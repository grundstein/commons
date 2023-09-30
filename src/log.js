import http2 from 'node:http2'

import magicLog from '@magic/log'
import is from '@magic/types'

import { getCurrentDate } from './lib/getCurrentDate.js'
import { getRequestDuration } from './lib/getRequestDuration.js'
import { getClientIp } from './lib/getClientIp.js'

const request = (stream, headers = {}, options = {}) => {
  const { headers : responseHeaders = {}, time, type = 'request', getFullIp = false } = options
  const duration = getRequestDuration(time)

  const timeData = getCurrentDate()

  const clientIp = getClientIp(stream, getFullIp)

  const response = [
    '{',
    ' "code": "',
    responseHeaders[http2.constants.HTTP2_HEADER_STATUS],
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
    headers[http2.constants.HTTP2_HEADER_PATH],
    '", ',
    '"ip": "',
    clientIp,
    '"}',
  ].join('')

  magicLog(response)
}

const error = (err, ...msgs) => {
  let msg = ''
  if (is.error(err)) {
    msg = `${err.code}: ${err.msg} ${msgs.join(' ')}`
  } else {
    msg = [err, ...msgs].join(' ')
  }

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
    msg,
    '" ',
    '}',
  ].join('')

  magicLog(response)
}

const info = (...msgs) => {
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

  magicLog(response)
}

const warn = (...msgs) => {
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

  magicLog(response)
}

export const log = magicLog

log.server = {
  request,
  info,
  error,
  warn,
}

export default log
