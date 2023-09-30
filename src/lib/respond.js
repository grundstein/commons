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
    head = {},
    time = log.hrtime(),
    type = 'response',
    getFullIp = false,
  } = payload

  head = {
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
    [HTTP2_HEADER_CONTENT_LENGTH]: Buffer.byteLength(body),
    [HTTP2_HEADER_CONTENT_ENCODING]: 'identity',
    [HTTP2_HEADER_STATUS]: code,
    ...head,
  }

  log.server.request(stream, headers, { head, time, type, getFullIp })

  stream.respond(head)

  if (body) {
    stream.write(body)
  }

  stream.end()
}
