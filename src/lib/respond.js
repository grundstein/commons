import http2 from 'node:http2'

import log from '../log.js'

const {
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants

export const respond = (stream, headers, payload = {}) => {
  let {
    body = '500 - Server Error',
    code = 500,
    headers : responseHeaders = {},
    time = log.hrtime(),
    type = 'response',
    getFullIp = false,
    json = false,
  } = payload

  const contentType = json ? 'application/json' : 'text/plain; charset=utf-8'

  responseHeaders = {
    [HTTP2_HEADER_CONTENT_TYPE]: contentType,
    [HTTP2_HEADER_CONTENT_LENGTH]: Buffer.byteLength(body),
    [HTTP2_HEADER_CONTENT_ENCODING]: 'identity',
    [HTTP2_HEADER_STATUS]: code,
    ...responseHeaders,
  }

  log.server.request(stream, headers, { headers: responseHeaders, time, type, getFullIp })

  stream.respond(responseHeaders)

  if (body) {
    stream.write(body)
  }

  stream.end()
}
