export const getRequestDuration = time => {
  // gets seconds and nanoseconds from the hrtime function.
  const [s, ns] = process.hrtime(time)

  // convert seconds to nanoseconds.
  let span = s * 1_000_000 + ns / 1_000
  let unit = 'ns'

  if (span > 1500000) {
    // elapsed time is bigger than 1.5 seconds, lets convert it to seconds
    unit = 's'
    span /= 1000000
    span /= 1000
  } else if (span > 1500) {
    // elapsed time is bigger than 1500 ms, lets convert it to ms
    unit = 'ms'
    span /= 1000
  }

  // lets remove the fractional numbers if possible. 1.00 turns into 1.0
  span = span.toFixed(1) / 1

  // lets return a nicely formatted number string
  return `${span}${unit}`
}
