import path from 'path'
import tls from 'tls'

import fs from '@magic/fs'

const getDomainContext = certDir => async domain => {
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

  secureContext[name] = context
}

export const createSecureContext = async certDir => {
  const secureContext = {}

  const availableCertificates = await fs.getDirectories(certDir)

  await Promise.all(availableCertificates.map(getDomainContext(certDir)))

  return secureContext
}
