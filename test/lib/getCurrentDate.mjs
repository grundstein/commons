import { is } from '@magic/test'

import { getCurrentDate } from '../../src/lib/getCurrentDate.mjs'

export default [
  {
    fn: getCurrentDate(),
    expect: t => is.string(t.time) && is.string(t.date),
    info: 'returns a date/time object holding strings',
  },
  {
    fn: getCurrentDate(),
    expect: t => t.time.split(':').length === 4,
    info: 'returns a time string including 3 ":"',
  },
  {
    fn: getCurrentDate(),
    expect: t => t.date.split('/').length === 3,
    info: 'returns a date string including 2 "/"',
  },
  {
    fn: getCurrentDate(),
    expect: t => {
      const [year, month, day] = t.date.split('/')
      const d = new Date()
      const currentDay = d.getDate()
      const currentMonth = d.getMonth() + 1
      const currentYear = d.getFullYear()
      return (
        parseInt(day) === currentDay &&
        parseInt(month) === currentMonth &&
        parseInt(year) === currentYear
      )
    },
    info: 'returns the current day, month and year correctly',
  },
  {
    fn: getCurrentDate(),
    expect: t => {
      const [hour, minute] = t.time.split(':')
      const d = new Date()
      const currentHour = d.getHours()
      const currentMinute = d.getMinutes()
      return parseInt(hour) === currentHour && parseInt(minute) === currentMinute
    },
    info: 'returns the current hour and minute correctly',
  },
]
