import path from 'path'

import http from 'http'
import https from 'https'

import { fs, middleware } from '../index.mjs'

export const createServer = async (config, handler) => {
  let connector = http

  const options = {}

  const { args, startTime } = config

  const { certDir, host, port } = args

  const privCertFile = path.join(certDir, 'priv.pem')
  const pubCertFile = path.join(certDir, 'pub.pem')

  try {
    options.key = await fs.readFile(privCertFile)
    options.cert = await fs.readFile(pubCertFile)
    connector = https
  } catch(e) {
    if (e.code !== 'ENOENT') {
      throw e
    }
  }

  const server = connector.createServer(options, handler)

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}
