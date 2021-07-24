import magicLog from '@magic/log'

import { getCurrentDate } from './lib/getCurrentDate.mjs'
import { getRequestDuration } from './lib/getRequestDuration.mjs'
import { getClientIp } from './lib/getClientIp.mjs'

const request = (req, res, { time, type = 'request', getFullIp = false }) => {
  const { statusCode } = res
  const { url } = req

  const duration = getRequestDuration(time)

  const timeData = getCurrentDate()

  const clientIp = getClientIp(req, getFullIp)

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
    '", ',
    '"ip": "',
    clientIp,
    '"}',
  ].join('')

  magicLog(response)
}

const error = (...msgs) => {
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

const log = magicLog

log.server = {
  request,
  info,
  error,
  warn,
}

export default log
