/**
 * @typedef {Object} FormattedDate
 * @property {string} date - Formatted date string (YYYY/MM/DD)
 * @property {string} time - Formatted time string (HH:MM:SS:mmm)
 */

/**
 * Gets current date and time formatted for logging
 * Date format: YYYY/MM/DD
 * Time format: HH:MM:SS:mmm (hours:minutes:seconds:milliseconds)
 * All values are zero-padded
 * @returns {FormattedDate} Object containing formatted date and time strings
 */
export const getCurrentDate = () => {
  const date = new Date()

  /** @type {string | number} */
  let day = date.getDate()
  /** @type {string | number} */
  let month = date.getMonth() + 1

  /** @type {string | number} */
  const year = date.getFullYear()

  /** @type {string | number} */
  let hour = date.getHours()
  /** @type {string | number} */
  let minute = date.getMinutes()
  /** @type {string | number} */
  let second = date.getSeconds()
  /** @type {string | number} */
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

  return {
    date: `${year}/${month}/${day}`,
    time: `${hour}:${minute}:${second}:${millisecond}`,
  }
}
