import { getFileEncoding } from './getFileEncoding.mjs'
import { respond } from './respond.mjs'

export const sendFile = (req, res, { file, code = 200, type = 'sendFile' }) => {
  const encoding = getFileEncoding(file, req.headers['accept-encoding'])

  const body = file[encoding] || file.buffer

  const headers = {
    'Content-Type': file.mime,
    'Content-Length': Buffer.byteLength(body),
    'Content-Encoding': encoding,
  }

  return respond(res, { code, headers, body })
}
