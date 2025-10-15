export function respond(
  stream: ServerHttp2Stream,
  headers: Http2Headers,
  payload?: RespondPayload,
): void
export type ServerHttp2Stream = import('node:http2').ServerHttp2Stream
export type Http2Headers = import('node:http2').IncomingHttpHeaders
export type Http2OutgoingHeaders = import('node:http2').OutgoingHttpHeaders
/**
 * Response payload structure.
 */
export type RespondPayload = {
  /**
   * - Response body content.
   */
  body?: string | Buffer<ArrayBufferLike> | undefined
  /**
   * - HTTP status code.
   */
  code?: number | undefined
  /**
   * - Additional response headers.
   */
  headers?: http2.OutgoingHttpHeaders | undefined
  /**
   * - Request start time (used for logging).
   */
  time?: [number, number] | undefined
  /**
   * - Type of log entry.
   */
  type?: string | undefined
  /**
   * - Whether to include the full IP address in logs.
   */
  getFullIp?: boolean | undefined
  /**
   * - Whether to send JSON content-type.
   */
  json?: boolean | undefined
}
import http2 from 'node:http2'
