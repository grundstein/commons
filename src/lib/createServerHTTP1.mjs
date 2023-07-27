import http from 'node:http'
import https from 'node:https'

import fs from '@magic/fs'

import log from '../log.mjs'
import * as middleware from '../../middleware.mjs'

import { createSecureContext } from './createSecureContext.mjs'
import { denyRequest } from './denyRequest.mjs'

export const createServerHTTP1 = async (config, handler) => {
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
