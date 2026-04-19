export interface OpsSyncState {
  enabled: boolean;
  disabled_reason: string | null;
  last_401_at: string | null;
  token_cached: boolean;
  token_cache_ttl_seconds: number | null;
}

export interface OpsEntitySyncRow {
  entity: string;
  last_synced_at: string | null;
  stale: boolean;
  record_count: number;
}

export interface OpsProxyPool {
  active_count: number;
  cooling_count: number;
  circuit_state: "closed" | "open" | "half_open" | string;
  saturation_events_24h: number | null;
  last_saturation_at: string | null;
}

export interface OpsSyncErrors {
  consecutive_failures_by_job: Record<string, number>;
  discards_24h_by_classification: Record<string, number>;
}

export interface OpsSyncStatusResponse {
  sync: OpsSyncState;
  last_sync_per_entity: OpsEntitySyncRow[];
  proxy_pool: OpsProxyPool;
  errors: OpsSyncErrors;
  generated_at: string;
}

export interface OpsUserStatsResponse {
  total_users: number;
  active_last_24h: number;
  pending_invitations: number;
  suspended: number;
  role_distribution: Record<string, number>;
  generated_at: string;
}
