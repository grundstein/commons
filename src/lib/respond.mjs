import { log } from '../log.mjs'
import { formatLog } from './formatLog.mjs'

export const respond = (res, payload = {}) => {
  const startTime = log.hrtime()

  const { code = 500, body = '500 - Server Error', headers } = payload

  const head = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Content-Encoding': 'identity',
    ...headers,
  }

  res.writeHead(code, head)
  res.end(body)

  formatLog(req, res, { time: startTime, type: 'response' })
}
