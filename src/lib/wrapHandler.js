import { constants } from 'node:http2'

import { denyRequest } from './denyRequest.js'
import { findFavicon } from './findFavicon.js'
import { respond } from './respond.js'

/**
 * @typedef {import('node:http2').ServerHttp2Stream} Http2Stream
 * @typedef {import('node:http2').IncomingHttpHeaders} Http2Headers
 * @typedef {(stream: Http2Stream, headers: Http2Headers, flags?: number) => void | Promise<void>} HandlerFunction
 */

/**
 * Wraps a handler with favicon handling and request denial logic.
 *
 * @param {Object} args
 * @param {Http2Stream} args.stream - HTTP/2 stream object.
 * @param {Http2Headers} args.headers - HTTP/2 request headers.
 * @param {number} [args.flags] - HTTP/2 stream flags.
 * @param {HandlerFunction} [args.handler] - User-provided request handler.
 * @returns {Promise<void>}
 */
export const wrapHandler = async ({ flags, handler, headers, stream }) => {
  if (!handler) {
    return
  }

  const faviconContent = await findFavicon()

  const pathname = headers[constants.HTTP2_HEADER_PATH]

  if (faviconContent && pathname === '/favicon.ico') {
    return respond(stream, headers, faviconContent)
  }

  if (denyRequest(stream, headers)) {
    return
  }

  return handler(stream, headers, flags)
}
