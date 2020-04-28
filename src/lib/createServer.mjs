import path from 'path'

import http from 'http'
import https from 'https'

import { fs } from '../index.mjs'

const prepareServer = async (args, handler) => {
  let connector = http

  const options = {}

  const { certDir } = args

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

  const server = connector.createServer(options, handler(config))

  return server
}
