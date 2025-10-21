import path from 'path'
import { createWriteStream } from 'fs'
import { Console } from 'console'

import { getCurrentDate, getRequestDuration } from './lib/index.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */

/**
 * @typedef {Object} FileLogOptions
 * @property {[number, number]} time - High-resolution time tuple
 * @property {string} [type='request'] - Type of request
 */

/**
 * Creates a request logger function
 * @param {Console} cons - Console instance for logging
 * @returns {(req: IncomingMessage, res: ServerResponse, options: FileLogOptions) => void}
 */
const request =
  cons =>
  (req, res, { time, type = 'request' }) => {
    const { statusCode } = res
    const { url } = req

    const duration = getRequestDuration(time)

    const timeData = getCurrentDate()

    const response = [
      '{',
      ' "code": "',
      statusCode,
      '", ',
      '"date": "',
      timeData.date,
      '", ',
      '"time": "',
      timeData.time,
      '", ',
      '"duration": "',
      duration,
      '", ',
      '"type": "',
      type,
      '", ',
      '"path": "',
      url,
      '" ',
      '}',
    ].join('')

    cons.log(response)
  }

/**
 * Creates an error logger function
 * @param {Console} cons - Console instance for logging
 * @returns {(...msgs: string[]) => void}
 */
const error =
  cons =>
  (...msgs) => {
    const { time, date } = getCurrentDate()

    const response = [
      '{',
      '"type": "error", ',
      '"date": "',
      date,
      '", ',
      '"time": "',
      time,
      '", ',
      '"msg": "',
      msgs.join(' '),
      '" ',
      '}',
    ].join('')

    cons.error(response)
  }

/**
 * Creates an info logger function
 * @param {Console} cons - Console instance for logging
 * @returns {(...msgs: string[]) => void}
 */
const info =
  cons =>
  (...msgs) => {
    const { time, date } = getCurrentDate()

    const response = [
      '{',
      '"type": "info", ',
      '"date": "',
      date,
      '", ',
      '"time": "',
      time,
      '", ',
      '"msg": "',
      msgs.join(' '),
      '" ',
      '}',
    ].join('')

    cons.info(response)
  }

/**
 * Creates a warn logger function
 * @param {Console} cons - Console instance for logging
 * @returns {(...msgs: string[]) => void}
 */
const warn =
  cons =>
  (...msgs) => {
    const { time, date } = getCurrentDate()

    const response = [
      '{',
      '"type": "warn", ',
      '"date": "',
      date,
      '", ',
      '"time": "',
      time,
      '", ',
      '"msg": "',
      msgs.join(' '),
      '" ',
      '}',
    ].join('')

    cons.warn(response)
  }

const defaultOutputPath = path.join('/var', 'log', 'grundstein')

/**
 * Creates a file logger with separate access and error log files
 * @param {string} [name] - Logger name (defaults to current directory name + random string)
 * @param {string} [outputPath] - Output directory path
 * @returns {{ request: Function, info: Function, error: Function, warn: Function }}
 */
export const fileLog = (name, outputPath = defaultOutputPath) => {
  if (!name) {
    const nameArray = process.cwd().split(path.sep)
    const namePart = `${nameArray[nameArray.length - 1]}`
    const random = (Math.random() + 1).toString(36).substr(15)
    name = `${namePart}-${random}`
  }

  const stdoutFile = path.join(outputPath, `${name}-access.log`)
  const stdoutStream = createWriteStream(stdoutFile)
  const stderrFile = path.join(outputPath, `${name}-error.log`)
  const stderrStream = createWriteStream(stderrFile)

  const cons = new Console(stdoutStream, stderrStream)

  return {
    request: request(cons),
    info: info(cons),
    error: error(cons),
    warn: warn(cons),
  }
}

export default fileLog
