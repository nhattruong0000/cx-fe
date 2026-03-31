/** Extract up to 2 initials from a full name, filtering empty segments */
export function getUserInitials(fullName?: string | null): string {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
