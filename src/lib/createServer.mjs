import path from 'path'
import crypto from 'crypto'

import http from 'http'
import https from 'https'

import fs from '@magic/fs'
import * as middleware from '../../middleware.mjs'

const getSecureContext = certDir => async domain => [
  domain,
  crypto.createCredentials({
    key: await fs.readFile(path.join(certDir, domain, 'privkey.pem')),
    cert: await fs.readFile(path.join(certDir, domain, 'fullchain.pem')),
  }).context
]


export const createServer = async (config, handler) => {
  const { args, certDir, host, port, startTime } = config

  const options = {}

  let connector = http

  if (certDir) {
    // const privCertFile = path.join(certDir, 'privkey.pem')
    // const pubCertFile = path.join(certDir, 'fullchain.pem')

    try {
      const availableCertificates = await fs.getDirectories(certDir)

      const domainList = await Promise.all(availableCertificates.map(getSecureContext(certDir)))

      const secureContext = Object.fromEntries(domainList)

      options.SNICallback = domain => secureContext[domain]

      // options.key = await fs.readFile(privCertFile)
      // options.cert = await fs.readFile(pubCertFile)
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
