export function sendStream(
  req: IncomingMessage,
  res: ServerResponse,
  options: SendStreamOptions,
): void
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type OutgoingHttpHeaders = import('http').OutgoingHttpHeaders
export type StreamFileObject = {
  /**
   * - File path
   */
  path: string
  /**
   * - File size in bytes
   */
  size: number
  /**
   * - MIME type
   */
  mime: string
}
export type SendStreamOptions = {
  /**
   * - File object to stream
   */
  file: StreamFileObject
  /**
   * - Additional HTTP headers
   */
  headers?: import('http').OutgoingHttpHeaders | undefined
}
