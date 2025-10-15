export function getHostname(headers: Http2Headers | Http1HeadersWrapper): string
/**
 * HTTP/2 headers.
 */
export type Http2Headers = import('node:http2').IncomingHttpHeaders
/**
 * HTTP/1.1 headers.
 */
export type Http1Headers = import('node:http').IncomingHttpHeaders
/**
 * Wrapper for HTTP/1.1 headers.
 */
export type Http1HeadersWrapper = {
  /**
   * - The HTTP/1.1 headers object.
   */
  headers: Http1Headers
  /**
   * - Optional hostname property.
   */
  hostname?: string | undefined
}
