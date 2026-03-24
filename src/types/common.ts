export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "agent" | "viewer";
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}
