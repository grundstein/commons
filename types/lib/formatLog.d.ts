export function formatLog(
  req: IncomingMessage,
  res: ServerResponse,
  { time, type, log }: FormatLogOptions,
): void
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type FormatLogOptions = {
  /**
   * - High-resolution time
   */
  time: [number, number]
  /**
   * - Log type
   */
  type?: string | undefined
  log?: import('../log.js').EnhancedLog | undefined
}
