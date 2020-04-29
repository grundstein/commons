import path from 'path'
import tls from 'tls'

import http from 'http'
import https from 'https'

import fs from '@magic/fs'
import * as middleware from '../../middleware.mjs'

const getSecureContext = async (domain, certDir) => {
  if (domain === certDir) {
    return false
  }

  const name = domain.split('/').pop()

  const keyFile = path.join(domain, 'privkey.pem')
  const key = await fs.readFile(keyFile)

  const chainFile = path.join(domain, 'fullchain.pem')
  const cert = await fs.readFile(chainFile)

  return [
    name,
    tls.createSecureContext({
      key,
      cert,
    }).context
  ]
}

export const createServer = async (config, handler) => {
  const { args, certDir, host, port, startTime } = config

  const options = {}

  let connector = http

  if (certDir) {
    try {
      const availableCertificates = await fs.getDirectories(certDir)

      const domainList = await Promise.all(availableCertificates.map(async d => await getSecureContext(d, certDir)))

      const secureContext = Object.fromEntries(domainList.filter(a => a))

      options.SNICallback = (domain, cb) => cb(null, secureContext[domain])

      connector = https
    } catch(e) {
      if (e.code === 'ENOENT') {
        log.error(e)
      } else {
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
