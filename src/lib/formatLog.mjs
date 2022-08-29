import http2 from 'node:http2'

import log from '../log.mjs'

import { getRequestDuration } from './getRequestDuration.mjs'
import { getCurrentDate } from './getCurrentDate.mjs'

const {
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_PATH,
} = http2.constants

export const formatLog = (stream, headers, { head, time, type = 'request' }) => {
  const url = headers[HTTP2_HEADER_PATH]
  const statusCode = head[HTTP2_HEADER_STATUS]

  const duration = getRequestDuration(time)

  const timeData = getCurrentDate()

  const response = [
    '{',
    '"code": "',
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

  log(response)
}
