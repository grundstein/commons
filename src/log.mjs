import magicLog from '@magic/log'

import { getCurrentDate, getRequestDuration } from './lib/index.mjs'

const request = (req, res, { time, type = 'request' }) => {
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
