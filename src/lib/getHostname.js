import http2 from 'node:http2'

const { HTTP2_HEADER_AUTHORITY } = http2.constants

export const getHostname = headers => {
  if (!headers) {
    return ''
  }

  // http 1.1, needed for redirects to https
  if (headers.headers) {
    const { hostname } = headers
    const head = headers.headers

    const host = head.host || head['x-forwarded-for'] || hostname || ''

    if (host.includes(',')) {
      return host.split(',')[0]
    }

    if (host.includes(':')) {
      return host.split(':')[0]
    }

    return host
  }

  // http 2
  const authority = headers[HTTP2_HEADER_AUTHORITY] || headers.host || ''

  if (authority.includes(',')) {
    /*
     * the first authority in a list is our origin
     */
    authority = authority.split(',')[0]
  }

  /*
   * remove port if it exists
   */
  if (authority.includes(':')) {
    return authority.split(':')[0]
  }

  return authority
}