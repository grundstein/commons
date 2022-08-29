import http2 from 'node:http2'
import path from 'node:path'

import { getFileEncoding } from './getFileEncoding.mjs'
import log from '../log.mjs'

const {
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_CONTENT_LENGTH,
  HTTP2_HEADER_CONTENT_ENCODING,
  HTTP2_HEADER_STATUS,
} = http2.constants

export const sendFile = (stream, headers, options) => {
  let { code = 200, head, file, time = log.hrtime() } = options

  const encoding = getFileEncoding(file, headers['accept-encoding'])

  head = {
    [HTTP2_HEADER_CONTENT_TYPE]: file.mime,
    [HTTP2_HEADER_CONTENT_LENGTH]: file.size,
    [HTTP2_HEADER_CONTENT_ENCODING]: encoding,
    [HTTP2_HEADER_STATUS]: code,
    ...head,
  }

  const onError = err => {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ [http2.constants.HTTP2_HEADER_STATUS]: 404 })
        log.server.error('E_404', `File not found: ${file.path}`)
      } else {
        stream.respond({ [http2.constants.HTTP2_HEADER_STATUS]: 500 })
        log.server.error('E_500', `Unknown Error: ${file.path}`)
      }
    } catch (err) {
      // Perform actual error handling.
      log.server.error(`E_${err.code}`, err.msg)
    }

    stream.end()
  }

  if (!path.isAbsolute(file.path)) {
    file.path = path.join(process.cwd(), file.path)
  }

  log.server.request(stream, headers, { head, time })
  return stream.respondWithFile(file.path, head, { onError })
}
