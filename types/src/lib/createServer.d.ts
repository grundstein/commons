export function createServer(
  config: ServerConfig,
  handler?: HandlerFunction,
): Promise<http2.Http2SecureServer>
export type ServerConfig = {
  /**
   * - Path to certificate directory.
   */
  certDir?: string | undefined
  /**
   * - Host to bind server to.
   */
  host?: string | undefined
  /**
   * - Port to listen on.
   */
  port?: number | undefined
  /**
   * - High-resolution start time.
   */
  startTime?: [number, number] | undefined
  /**
   * - Private key file name.
   */
  keyFileName?: string | undefined
  /**
   * - Certificate chain file name.
   */
  chainFileName?: string | undefined
}
export type HandlerFunction = (
  stream: http2.ServerHttp2Stream,
  headers: http2.IncomingHttpHeaders,
  flags?: number,
) => void
import http2 from 'node:http2'
