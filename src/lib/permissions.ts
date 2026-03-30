export function hasPermission(
  userPermissions: string[],
  required: string
): boolean {
  return userPermissions.includes(required);
}

export function hasAnyPermission(
  userPermissions: string[],
  required: string[]
): boolean {
  return required.length === 0 || required.some((p) => userPermissions.includes(p));
}
