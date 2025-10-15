export function createServerHTTP1(
  config: ServerConfig,
  handler: RequestHandler,
): Promise<http.Server | https.Server>
export type ServerConfig = {
  /**
   * - Directory containing SSL certificates.
   */
  certDir?: string | undefined
  /**
   * - Host to bind the server to.
   */
  host?: string | undefined
  /**
   * - Port number or string.
   */
  port?: number | undefined
  /**
   * - High-resolution time tuple from process.hrtime().
   */
  startTime?: [number, number] | undefined
}
export type RequestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void
import http from 'node:http'
import https from 'node:https'
