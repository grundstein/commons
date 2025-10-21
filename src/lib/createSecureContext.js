import path from 'path'
import tls from 'tls'

import fs from '@magic/fs'

/**
 * @typedef {import('tls').SecureContext} SecureContext
 */

/*
 * TODO: rewrite this function in rust to make sure we instantly forget the contents of the secret files.
 */

/**
 * Creates a secure context for a single domain
 * @param {string} certDir - Certificate directory path
 * @returns {(domain: string) => Promise<[string, SecureContext] | null>} Function that creates context for a domain
 */
const getDomainContext = certDir => async domain => {
  if (domain === certDir) {
    return null
  }

  const name = domain.split('/').pop()

  if (!name) {
    return null
  }

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

/**
 * Creates secure contexts for all available certificates in directory
 * Returns object mapping domain names to their secure contexts
 * @param {string} certDir - Certificate directory path
 * @returns {Promise<Object.<string, SecureContext>>} Object mapping domains to secure contexts
 */
export const createSecureContext = async certDir => {
  const availableCertificates = await fs.getDirectories(certDir, { noRoot: true })

  const domainContextCreator = getDomainContext(certDir)

  const contextArray = await Promise.all(availableCertificates.map(domainContextCreator))
  const filteredContextArray = contextArray.filter(entry => entry !== null)
  const secureContext = Object.fromEntries(filteredContextArray)

  return secureContext
}
