import { notFound } from "next/navigation";

/** Catch-all for unmatched routes within dashboard layout group.
 *  Triggers (dashboard)/not-found.tsx so 404 keeps sidebar intact. */
export default function CatchAllNotFound() {
  notFound();
}
