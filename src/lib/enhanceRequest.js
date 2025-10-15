// @ts-check

import log from '../log.js'

/**
 * @typedef {import('node:http2').ServerHttp2Stream & { startTime?: ReturnType<typeof process.hrtime> }} EnhancedHttp2Stream
 */

/**
 * Adds a high-resolution start time to an HTTP/2 stream.
 *
 * @param {import('node:http2').ServerHttp2Stream | object} stream
 * @returns {EnhancedHttp2Stream | { startTime?: ReturnType<typeof process.hrtime>}}
 */
export const enhanceRequest = (stream = {}) => {
  /** @type {EnhancedHttp2Stream | { startTime?: ReturnType<typeof process.hrtime>}} */
  const s = stream
  s.startTime = log.hrtime()

  return s
}
