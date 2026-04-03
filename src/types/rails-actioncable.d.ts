declare module "@rails/actioncable" {
  export interface Consumer {
    subscriptions: Subscriptions
    disconnect(): void
  }

  export interface Subscriptions {
    create(
      channel: string | object,
      mixin?: Partial<CreateMixin>
    ): Subscription
  }

  export interface CreateMixin {
    connected(): void
    disconnected(): void
    received(data: unknown): void
    rejected(): void
  }

  export interface Subscription {
    perform(action: string, data?: object): void
    send(data: object): void
    unsubscribe(): void
  }

  export function createConsumer(url?: string): Consumer
}
