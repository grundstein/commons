import { log } from '../log.mjs'
import { getFileEncoding } from './getFileEncoding.mjs'

export const sendFile = (req, res, file) => {
  const encoding = getFileEncoding(file, req.headers['accept-encoding'])
  const body = file[encoding] || file.buffer

  if (!body) {
    log.error('E_NO_CONTENT', { url: req.url, code: 404 })
    respond(req, { code: 404, body: '404 - not found.' })
    return
  }

  const headers = {
    'Content-Type': file.mime,
    'Content-Length': Buffer.byteLength(fileContent),
    'Content-Encoding': encoding,
  }

  return respond(res, { code: 200, headers, body })
}
