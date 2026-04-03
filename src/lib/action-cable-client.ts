import { createConsumer, type Consumer } from "@rails/actioncable"
import { useAuthStore } from "@/stores/auth-store"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

/** Singleton consumer — one WebSocket connection shared across all hooks */
let consumer: Consumer | null = null
let consumerToken: string | null = null

/** Get or create a singleton ActionCable consumer.
 *  Reconnects if the JWT token changes (e.g., after refresh). */
export function getCableConsumer(): Consumer | null {
  const token = useAuthStore.getState().tokens?.access_token
  if (!token) return null

  // Reconnect if token changed (e.g., after refresh)
  if (consumer && consumerToken !== token) {
    consumer.disconnect()
    consumer = null
  }

  if (!consumer) {
    const wsBase = BASE_URL.replace(/^http/, "ws")
    consumer = createConsumer(`${wsBase}/cable?token=${token}`)
    consumerToken = token
  }

  return consumer
}

/** Disconnect and clear the singleton consumer (e.g., on logout) */
export function disconnectCable(): void {
  if (consumer) {
    consumer.disconnect()
    consumer = null
    consumerToken = null
  }
}
