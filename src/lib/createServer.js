import http from 'http'
import https from 'https'

import fs from '@magic/fs'

import log from '../log.js'
import * as middleware from '../middleware/index.js'

import { createSecureContext } from './createSecureContext.js'
import { denyRequest } from './denyRequest.js'

export const createServer = async (config, handler) => {
  const { certDir, host = 'localhost', port = '2350', startTime = log.hrtime() } = config

  const options = {}

  let connector = http

  if (certDir) {
    try {
      const certDirExists = await fs.exists(certDir)

      if (certDirExists) {
        const secureContext = await createSecureContext(certDir)

        options.SNICallback = (domain, cb) => {
          const apex = domain.split('.').slice(-2).join('.')
          cb(null, secureContext[apex])
        }

        connector = https
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        log.server.error(e)
      } else {
        throw e
      }
    }
  }

  const wrappedHandler = (req, res) => {
    if (denyRequest(req)) {
      return
    }

    return handler(req, res)
  }

  const server = connector.createServer(options, wrappedHandler)

  const clientError = middleware.clientError(config)
  server.on('clientError', clientError)

  const listener = middleware.listener({ host, port, startTime })
  server.listen(port, host, listener)

  return server
}
