const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.345, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

/** Formats an ISO timestamp into a relative string like "2 hours ago" */
export function formatRelativeTime(timestamp: string): string {
  const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  let seconds = (new Date(timestamp).getTime() - Date.now()) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(seconds) < division.amount) {
      return rtf.format(Math.round(seconds), division.unit);
    }
    seconds /= division.amount;
  }

  return new Date(timestamp).toLocaleDateString();
}
