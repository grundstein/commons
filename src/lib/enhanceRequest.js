import log from '../log.js'

/**
 * @typedef {import('node:http2').ServerHttp2Stream & { startTime?: ReturnType<typeof process.hrtime> }} EnhancedHttp2Stream
 */

/**
 * Adds a high-resolution start time to an HTTP/2 stream.
 *
 * @param {EnhancedHttp2Stream} stream
 * @returns {EnhancedHttp2Stream}
 */
export const enhanceRequest = stream => {
  stream.startTime = log.hrtime()

  return stream
}
