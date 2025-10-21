import { getFileEncoding } from './getFileEncoding.js'
import { respond } from './respond.js'

export const sendFile = (req, res, options) => {
  const { file, code = 200, type = 'sendFile' } = options
  let { headers = {} } = options

  const encoding = getFileEncoding(file, req.headers['accept-encoding'])

  const body = file[encoding] || file.buffer

  headers = {
    ...headers,
    'Content-Type': file.mime,
  }

  if (file[encoding]) {
    headers['Content-Encoding'] = encoding
  }

  return respond(req, res, { code, headers, body, type })
}
