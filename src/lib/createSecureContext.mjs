import path from 'path'
import tls from 'tls'

import fs from '@magic/fs'

/*
 * TODO: rewrite this function in rust to make sure we instantly forget the contents of the secret files.
 */
const getDomainContext = (certDir) => async domain => {
  if (domain === certDir) {
    return false
  }

  const name = domain.split('/').pop()

  const keyFile = path.join(domain, 'privkey.pem')
  const key = await fs.readFile(keyFile)

  const chainFile = path.join(domain, 'fullchain.pem')
  const cert = await fs.readFile(chainFile)

  const { context } = tls.createSecureContext({
    key,
    cert,
  })

  return [name, context]
}

export const createSecureContext = async certDir => {
  const availableCertificates = await fs.getDirectories(certDir)

  const domainContextCreator = getDomainContext(certDir)

  const contextArray = await Promise.all(availableCertificates.map(domainContextCreator))
  const secureContext = Object.fromEntries(contextArray)

  return secureContext
}
