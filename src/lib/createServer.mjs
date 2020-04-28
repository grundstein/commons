import path from 'path'

import http from 'http'
import https from 'https'

import fs from '@magic/fs'
import * as middleware from '../../middleware.mjs'

export const createServer = async (config, handler) => {
  const { args, certDir, host, port, startTime } = config

  const options = {}

  let connector = http

  if (certDir) {
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
  }

  const server = connector.createServer(options, handler)

  const clientError = middleware.clientError(config)
  server.on('clientError', clientError)

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}
