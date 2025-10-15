import http2 from 'node:http2'
import path from 'node:path'
import { createWriteStream } from 'node:fs'
import { Console } from 'node:console'

import { getCurrentDate, getRequestDuration } from './lib/index.js'

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
const request =
  cons =>
  (headers, { time, type = 'request' }) => {
    const statusCode = headers[http2.constants.HTTP2_HEADER_STATUS] ?? ''
    const url = headers[http2.constants.HTTP2_HEADER_PATH] ?? ''
    const duration = getRequestDuration(time)
    const timeData = getCurrentDate()

    const response = JSON.stringify({
      code: statusCode,
      date: timeData.date,
      time: timeData.time,
      duration,
      type,
      path: url,
    })

    cons(response)
  }

/**
 * Creates an error logger function.
 * @param {LogConsumer} cons
 * @returns {(...msgs: string[]) => void}
 */
const error =
  cons =>
  (...msgs) => {
    const { time, date } = getCurrentDate()

    const response = JSON.stringify({
      type: 'error',
      date,
      time,
      msg: msgs.join(' '),
    })

    cons(response)
  }

/**
 * Creates an info logger function.
 * @param {LogConsumer} cons
 * @returns {(...msgs: string[]) => void}
 */
const info =
  cons =>
  (...msgs) => {
    const { time, date } = getCurrentDate()

    const response = JSON.stringify({
      type: 'info',
      date,
      time,
      msg: msgs.join(' '),
    })

    cons(response)
  }

/**
 * Creates a warning logger function.
 * @param {LogConsumer} cons
 * @returns {(...msgs: string[]) => void}
 */
const warn =
  cons =>
  (...msgs) => {
    const { time, date } = getCurrentDate()

    const response = JSON.stringify({
      type: 'warn',
      date,
      time,
      msg: msgs.join(' '),
    })

    cons(response)
  }

const defaultOutputPath = path.join('/var', 'log', 'grundstein')

/**
 * Creates file-based loggers that output JSON logs.
 *
 * @param {string} [name] - Optional name for the log files. Defaults to current folder name + random suffix.
 * @param {string} [outputPath=defaultOutputPath] - Directory to store the logs.
 * @returns {{
 *   request: ReturnType<typeof request>,
 *   info: ReturnType<typeof info>,
 *   error: ReturnType<typeof error>,
 *   warn: ReturnType<typeof warn>
 * }}
 */
export const fileLog = (name, outputPath = defaultOutputPath) => {
  if (!name) {
    const nameArray = process.cwd().split(path.sep)
    const namePart = nameArray[nameArray.length - 1]
    const random = Math.random().toString(36).slice(2, 10)
    name = `${namePart}-${random}`
  }

  const stdoutFile = path.join(outputPath, `${name}-access.log`)
  const stderrFile = path.join(outputPath, `${name}-error.log`)

  const stdoutStream = createWriteStream(stdoutFile, { flags: 'a' })
  const stderrStream = createWriteStream(stderrFile, { flags: 'a' })

  const cons = new Console(stdoutStream, stderrStream)

  return {
    request: request(cons.log.bind(cons)),
    info: info(cons.log.bind(cons)),
    error: error(cons.error.bind(cons)),
    warn: warn(cons.warn.bind(cons)),
  }
}

export default fileLog
