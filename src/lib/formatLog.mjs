import log from '../log.mjs'
import { getRequestDuration } from './getRequestDuration.mjs'
import { getCurrentDate } from './getCurrentDate.mjs'

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
    '"day": "',
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
