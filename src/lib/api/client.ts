import { useAuthStore } from "@/stores/auth-store";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/** Mutex to prevent concurrent refresh attempts */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

async function refreshAccessToken(): Promise<string | null> {
  const { tokens, setTokens, logout } = useAuthStore.getState();
  if (!tokens?.refresh_token) {
    logout();
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/auth/sessions/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: tokens.refresh_token,
        }),
      }
    );

    if (!res.ok) {
      logout();
      return null;
    }

    const data = await res.json();
    setTokens(data.tokens);
    return data.tokens.access_token;
  } catch {
    logout();
    return null;
  }
}

async function getValidToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  return useAuthStore.getState().tokens?.access_token ?? null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getValidToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 — attempt token refresh once
  if (res.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
      });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error: ApiError = {
      status: res.status,
      message: body.message || res.statusText,
      errors: body.errors,
    };
    throw error;
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};
