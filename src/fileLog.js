import http2 from 'node:http2'
import path from 'node:path'
import { createWriteStream } from 'node:fs'

import { getCurrentDate, getRequestDuration } from './lib/index.js'

const request =
  cons =>
  (headers, { time, type = 'request' }) => {
    const statusCode = headers[http2.constants.HTTP2_HEADER_STATUS]
    const url = headers[http2.constants.HTTP2_HEADER_PATH]

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

    cons(response)
  }

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

    cons(response)
  }

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

    cons(response)
  }

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

    cons(response)
  }

const defaultOutputPath = path.join('/var', 'log', 'grundstein')

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

  const cons = console.Console(stdoutStream, stderrStream)

  return {
    request: request(cons),
    info: info(cons),
    error: error(cons),
    warn: warn(cons),
  }
}

export default fileLog
