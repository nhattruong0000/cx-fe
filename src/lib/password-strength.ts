import type { StrengthLevel } from "@/components/ui/progress"

/**
 * Calculate password strength on a 0-4 scale.
 * 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
 */
export function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return 0

  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  return score as StrengthLevel
}
