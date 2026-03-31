/** Map status strings to Badge variants */
export function statusVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "active" || s === "open" || s === "completed") return "success" as const;
  if (s === "pending" || s === "draft") return "warning" as const;
  return "secondary" as const;
}

/** Format ISO date to readable string */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
