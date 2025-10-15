export function denyRequest(
  stream?: StreamLike | http2.ServerHttp2Stream,
  headers?: http2.IncomingHttpHeaders,
): boolean
export type StreamLike = {
  /**
   * - HTTP/1.1 URL.
   */
  url?: string | undefined
  /**
   * - Function to destroy the stream/socket.
   */
  destroy?: (() => void) | undefined
  /**
   * - Optional socket reference for HTTP/1.1 requests.
   */
  socket?: any
}
import http2 from 'node:http2'
