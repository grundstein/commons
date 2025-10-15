import is from '@magic/types'
import http2 from 'node:http2'

const { HTTP2_HEADER_AUTHORITY } = http2.constants

/**
 * HTTP/2 headers.
 * @typedef {import('node:http2').IncomingHttpHeaders} Http2Headers
 */

/**
 * HTTP/1.1 headers.
 * @typedef {import('node:http').IncomingHttpHeaders} Http1Headers
 */

/**
 * Wrapper for HTTP/1.1 headers.
 * @typedef {Object} Http1HeadersWrapper
 * @property {Http1Headers} headers - The HTTP/1.1 headers object.
 * @property {string} [hostname] - Optional hostname property.
 */

/**
 * Extracts the hostname from HTTP/1.1 or HTTP/2 headers.
 *
 * @param {Http2Headers | Http1HeadersWrapper} headers
 * @returns {string} Hostname without port.
 */
export const getHostname = headers => {
  if (!headers) return ''

  // HTTP/1.1 case
  if ('headers' in headers && headers.headers && typeof headers.headers === 'object') {
    const { hostname } = headers
    const head = /** @type {Http1Headers} */ (headers.headers)

    /** @type {string | undefined} */
    let host

    if (typeof head.host === 'string') {
      host = head.host
    } else if (Array.isArray(head.host)) {
      host = head.host[0]
    } else if (typeof head['x-forwarded-for'] === 'string') {
      host = head['x-forwarded-for']
    } else if (Array.isArray(head['x-forwarded-for'])) {
      host = head['x-forwarded-for'][0]
    } else {
      host = is.array(hostname) ? hostname[0] : hostname
    }

    host = host || ''

    if (host.includes(',')) {
      return host.split(',')[0]
    }
    if (host.includes(':')) {
      return host.split(':')[0]
    }

    return host
  }

  /** @type {string | string[] | undefined} */
  let val

  if (!('headers' in headers)) {
    // headers is definitely Http2Headers
    val = headers[HTTP2_HEADER_AUTHORITY] ?? headers.host
  } else {
    // headers is Http1HeadersWrapper; it does not have HTTP2_HEADER_AUTHORITY
    val = undefined
  }

  /** @type {string} */
  let authority = ''

  if (typeof val === 'string') {
    authority = val
  } else if (Array.isArray(val)) {
    authority = val[0]
  }

  if (authority.includes(',')) {
    authority = authority.split(',')[0]
  }
  if (authority.includes(':')) {
    return authority.split(':')[0]
  }

  return authority
}
