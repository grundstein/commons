export const getRequestDuration = time => {
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

  return `${span}${unit}`
}
