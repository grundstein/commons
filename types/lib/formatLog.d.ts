export function formatLog(headers: Http2Headers, { head, time, type }: FormatLogOptions): void
export type Http2Headers = import('node:http2').IncomingHttpHeaders
export type Head = {
  [key: string]: string | number
}
export type FormatLogOptions = {
  /**
   * - The HTTP/2 HEADERS frame
   */
  head: Head
  /**
   * - Request start timestamp (ms or hrtime)
   */
  time: ReturnType<typeof process.hrtime>
  /**
   * - Log type, default 'request'
   */
  type?: string | undefined
}
