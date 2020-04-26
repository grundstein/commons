import { log } from '../log.mjs'

export const formatLog = (req, res, { time, type = 'request' }) => {
  const { statusCode } = res
  const { url, id } = req

  const [s, ns] = process.hrtime(time)
  let span = s * 1000000 + ns / 1000
  let unit = 'ns'

  if (span > 1500000) {
    unit = 's'
    span = span / 1000000
  } else if (ns > 1500) {
    unit = 'ms'
    span = span / 1000
  }

  span = span.toFixed(1)

  const duration = `${span}${unit}`

  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  const year = date.getFullYear()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let millisecond = date.getMilliseconds()

  if (day < 10) {
    day = `0${day}`
  }

  if (month < 10) {
    month = `0${month}`
  }
  if (hour < 10) {
    hour = `0${hour}`
  }
  if (minute < 10) {
    minute = `0${minute}`
  }
  if (second < 10) {
    second = `0${second}`
  }
  if (millisecond < 100) {
    if (millisecond < 10) {
      millisecond = `0${millisecond}`
    }
    millisecond = `0${millisecond}`
  }

  const dayString = `${year}/${month}/${day}`
  const timeString = `${hour}:${minute}:${second}:${millisecond}`

  const response = [
    '{',
    '"code": "',
    statusCode,
    '", ',
    '"day": "',
    dayString,
    '", ',
    '"time": "',
    timeString,
    '", ',
    '"duration": "',
    duration,
    '", ',
    '"type": "',
    type,
    '", ',
    '"id": "',
    id,
    '", ',
    '"path": "',
    url,
    '" ',
    '}',
  ].join('')

  log(response)
}
