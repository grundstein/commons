export function respond(req: IncomingMessage, res: ServerResponse, payload?: RespondPayload): void
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type OutgoingHttpHeaders = import('http').OutgoingHttpHeaders
export type RespondPayload = {
  /**
   * - Response body
   */
  body?: string | Buffer<ArrayBufferLike> | undefined
  /**
   * - HTTP status code
   */
  code?: number | undefined
  /**
   * - HTTP headers
   */
  headers?: import('http').OutgoingHttpHeaders | undefined
  /**
   * - High-resolution time
   */
  time?: [number, number] | undefined
  /**
   * - Response type
   */
  type?: string | undefined
  /**
   * - Whether to get full IP address
   */
  getFullIp?: boolean | undefined
}
