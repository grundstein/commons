/**
 * Calculates request duration from high-resolution start time
 * Returns formatted duration with appropriate unit (ns, ms, or s)
 * @param {[number, number]} time - High-resolution time from process.hrtime()
 * @returns {string} Formatted duration string (e.g., "123.4ms", "1.5s")
 */
export const getRequestDuration = time => {
  const [s, ns] = process.hrtime(time)

  let span = s * 1000000 + ns / 1000
  let unit = 'ns'

  if (span > 1500000) {
    unit = 's'
    span /= 1000000
    span /= 1000
  } else if (ns > 1500) {
    unit = 'ms'
    span /= 1000
  }

  return `${parseFloat(span.toFixed(1)) / 1}${unit}`
}
