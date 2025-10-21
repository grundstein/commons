import log from '../log.js'

import { getRequestDuration } from './getRequestDuration.js'
import { getCurrentDate } from './getCurrentDate.js'

export const formatLog = (req, res, { time, type = 'request' }) => {
  const { statusCode } = res
  const { url } = req

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
