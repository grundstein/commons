export function listener({ startTime, host, port }: ListenerConfig): () => void
export type ListenerConfig = {
  /**
   * - Server start time
   */
  startTime: [number, number]
  /**
   * - Server host
   */
  host: string
  /**
   * - Server port
   */
  port: number
}
