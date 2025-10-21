export function createServer(
  config: ServerConfig,
  handler: RequestHandler,
): Promise<Server | HttpsServer>
export type IncomingMessage = import('http').IncomingMessage
export type ServerResponse = import('http').ServerResponse
export type Server = import('http').Server
export type HttpsServer = import('https').Server
export type SecureContext = import('tls').SecureContext
export type ServerConfig = {
  /**
   * - Certificate directory path
   */
  certDir?: string | undefined
  /**
   * - Server host
   */
  host?: string | undefined
  /**
   * - Server port
   */
  port?: number | undefined
  /**
   * - Server start time
   */
  startTime?: [number, number] | undefined
}
export type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void
