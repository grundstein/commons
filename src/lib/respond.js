import log from '../log.js'

export const respond = (req, res, payload = {}) => {
  const {
    body = '500 - Server Error',
    code = 500,
    headers = [],
    time = log.hrtime(),
    type = 'response',
    getFullIp = false,
  } = payload

  const head = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Content-Encoding': 'identity',
    ...headers,
  }

  res.writeHead(code, head)
  res.end(body)

  log.server.request(req, res, { time, type, getFullIp })
}
