export function fileLog(
  name?: string,
  outputPath?: string,
): {
  request: ReturnType<typeof request>
  info: ReturnType<typeof info>
  error: ReturnType<typeof error>
  warn: ReturnType<typeof warn>
}
export default fileLog
export type WriteStream = import('node:fs').WriteStream
export type IncomingHttpHeaders = import('node:http2').IncomingHttpHeaders
export type LogConsumer = (msg: string) => void
export type RequestOptions = {
  time: ReturnType<typeof process.hrtime>
  type?: string | undefined
}
/**
 * @typedef {import('node:fs').WriteStream} WriteStream
 * @typedef {import('node:http2').IncomingHttpHeaders} IncomingHttpHeaders
 */
/**
 * @callback LogConsumer
 * @param {string} msg
 * @returns {void}
 */
/**
 * @typedef {Object} RequestOptions
 * @property {ReturnType<typeof process.hrtime>} time
 * @property {string} [type]
 */
/**
 * Creates a request logger function.
 * @param {LogConsumer} cons
 * @returns {(headers: IncomingHttpHeaders, options: RequestOptions) => void}
 */
declare function request(
  cons: LogConsumer,
): (headers: IncomingHttpHeaders, options: RequestOptions) => void
/**
 * Creates an info logger function.
 * @param {LogConsumer} cons
 * @returns {(...msgs: string[]) => void}
 */
declare function info(cons: LogConsumer): (...msgs: string[]) => void
/**
 * Creates an error logger function.
 * @param {LogConsumer} cons
 * @returns {(...msgs: string[]) => void}
 */
declare function error(cons: LogConsumer): (...msgs: string[]) => void
/**
 * Creates a warning logger function.
 * @param {LogConsumer} cons
 * @returns {(...msgs: string[]) => void}
 */
declare function warn(cons: LogConsumer): (...msgs: string[]) => void
