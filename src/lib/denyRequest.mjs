import http2 from 'node:http2'

import is from '@magic/types'

const { HTTP2_HEADER_PATH } = http2.constants

export const denyRequest = (stream = {}, headers = {}) => {
  // http 1.1
  let url = ''
  if (stream && stream.socket && stream.url) {
    // our "stream" is actually a Request object
    url = stream.url
    stream = stream.socket
  } else {
    /*
     * true http2 request here.
     */
    if (!headers) {
      return true
    }

    url = headers[HTTP2_HEADER_PATH]
  }

  /*
   * if the url does not exist, does not start with '/'
   * or if it includes '://',
   * something fishy is going on for sure,
   * let's catch that case and do nothing in response.
   */
  if (is.empty(url) || !url.startsWith('/') || url.includes('://')) {
    /*
     * disconnect from the client.
     */
    if (is.fn(stream?.destroy)) {
      stream.destroy()
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
