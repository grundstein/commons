export const getCurrentDate = () => {
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

  return {
    date: `${year}/${month}/${day}`,
    time: `${hour}:${minute}:${second}:${millisecond}`,
  }
}
