/** Generate consistent avatar color from name string */
const AVATAR_COLORS = [
  "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6",
  "#EF4444", "#EC4899", "#06B6D4", "#F97316",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Extract initials from full name (first + last word) */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
