import path from 'path'
import tls from 'tls'

import fs from '@magic/fs'

/*
 * TODO: rewrite this function in rust to make sure we can instantly forget the contents of the secret files.
 */
const getDomainContext =
  ({ certDir, host }) =>
  async domain => {
    if (domain === certDir) {
      return false
    }

    const name = path.basename(domain)

    try {
      const keyFile = path.join(domain, 'priv.pem')
      const chainFile = path.join(domain, 'cert.pem')

      const caFile = path.join(domain, 'cert.pem')

      let ca = undefined
      if (process.env.NODE_ENV === 'development' && host === 'localhost') {
        ca = await fs.readFile(caFile)
      }

      const key = await fs.readFile(keyFile)

      const cert = await fs.readFile(chainFile)
      const { context } = tls.createSecureContext({
        key,
        cert,
        ca,
      })

      return [name, context]
    } catch (e) {
      throw e
    }
  }

export const createSecureContext = async args => {
  const { certDir, host } = args
  console.log(certDir)

  const availableCertificates = await fs.getDirectories(certDir, { noRoot: true })

  const domainContextCreator = getDomainContext(args)

  const contextArray = await Promise.all(availableCertificates.map(domainContextCreator))
  const secureContext = Object.fromEntries(contextArray)

  return secureContext
}
