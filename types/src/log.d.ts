/**
 * @typedef {{
 *   server: {
 *     request: typeof request,
 *     info: typeof info,
 *     error: typeof error,
 *     warn: typeof warn,
 *   }
 * } & typeof magicLog} MagicLogExtended
 */
/** @type {MagicLogExtended} */
export const log: MagicLogExtended
export default log
export type ServerHttp2Stream = import('node:http2').ServerHttp2Stream
export type IncomingHttpHeaders = import('node:http2').IncomingHttpHeaders
export type OutgoingHttpHeader = import('node:http2').OutgoingHttpHeaders
export type RequestLogOptions = {
  /**
   * - The response headers.
   */
  headers?: http2.IncomingHttpHeaders | http2.OutgoingHttpHeaders | undefined
  /**
   * - Timestamp for request start.
   */
  time?: [number, number] | undefined
  /**
   * - Log type.
   */
  type?: string | undefined
  /**
   * - Whether to include full IP.
   */
  getFullIp?: boolean | undefined
}
export type MagicLogExtended = {
  server: {
    request: typeof request
    info: typeof info
    error: typeof error
    warn: typeof warn
  }
} & typeof magicLog
import http2 from 'node:http2'
/**
 * @typedef {import('node:http2').ServerHttp2Stream} ServerHttp2Stream
 * @typedef {import('node:http2').IncomingHttpHeaders} IncomingHttpHeaders
 * @typedef {import('node:http2').OutgoingHttpHeaders} OutgoingHttpHeader
 */
/**
 * @typedef {Object} RequestLogOptions
 * @property {IncomingHttpHeaders | OutgoingHttpHeader} [headers] - The response headers.
 * @property {ReturnType<typeof process.hrtime>} [time] - Timestamp for request start.
 * @property {string} [type='request'] - Log type.
 * @property {boolean} [getFullIp=false] - Whether to include full IP.
 */
/**
 * Logs a request entry.
 * @param {ServerHttp2Stream} stream - The HTTP2 stream for the request.
 * @param {IncomingHttpHeaders | OutgoingHttpHeader} [headers={}] - The incoming request headers.
 * @param {RequestLogOptions} [options={}] - Logging options.
 * @returns {void}
 */
declare function request(
  stream: ServerHttp2Stream,
  headers?: IncomingHttpHeaders | OutgoingHttpHeader,
  options?: RequestLogOptions,
): void
/**
 * Logs an informational message.
 * @param {...string} msgs
 * @returns {void}
 */
declare function info(...msgs: string[]): void
/**
 * Logs an error entry.
 * @param {import('@magic/error').CustomError | string} err - The error object or message.
 * @param {...string} msgs - Additional context messages.
 * @returns {void}
 */
declare function error(err: import('@magic/error').CustomError | string, ...msgs: string[]): void
/**
 * Logs a warning message.
 * @param {...string} msgs
 * @returns {void}
 */
declare function warn(...msgs: string[]): void
import magicLog from '@magic/log'
