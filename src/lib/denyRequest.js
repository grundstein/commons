import http2 from 'node:http2'
import is from '@magic/types'

const { HTTP2_HEADER_PATH } = http2.constants

/**
 * @typedef {Object} StreamLike
 * @property {string} [url] - HTTP/1.1 URL.
 * @property {function():void} [destroy] - Function to destroy the stream/socket.
 * @property {any} [socket] - Optional socket reference for HTTP/1.1 requests.
 */

/**
 * @param {StreamLike | http2.ServerHttp2Stream} [stream={}]
 * @param {http2.IncomingHttpHeaders} [headers={}]
 * @returns {boolean}
 */
export const denyRequest = (stream = {}, headers = {}) => {
  /** @type {any} */
  let s = stream

  // http 1.1
  let pathname = ''
  if (s && s.socket && s.url) {
    // our "stream" is actually a Request object
    pathname = s.url
    s = s.socket
  } else {
    /*
     * true http2 request here.
     */
    if (!headers) {
      return true
    }

    if (is.string(headers[HTTP2_HEADER_PATH])) {
      pathname = headers[HTTP2_HEADER_PATH]
    } else if (is.array(headers[HTTP2_HEADER_PATH])) {
      pathname = headers[HTTP2_HEADER_PATH][0]
    }
  }

  /*
   * if the pathname does not exist, does not start with '/'
   * or if it includes '://',
   * something fishy is going on for sure,
   * let's catch that case and do nothing in response.
   */
  if (is.empty(pathname) || !pathname.startsWith('/') || pathname.includes('://')) {
    /*
     * disconnect from the client.
     */
    if (is.fn(s?.destroy)) {
      s.destroy()
    }

    /*
     * Make sure we return true here,
     * this keeps everyone else's requests serve fine
     * even if this function is hammered and the cpu is at 100%.
     */
    return true
  }

  /*
   * all seems fine, continue with the request/response cycle
   */
  return false
}
