import path from 'node:path'
import tls from 'node:tls'

import { log } from '../log.js'
import fs from '@magic/fs'

/**
 * @typedef {Object} DomainContextOptions
 * @property {string} certDir - Base directory containing certificates.
 * @property {string} host - Hostname of the current server (e.g. "example.com" or "localhost").
 * @property {string} domain - Path or folder name of the domain’s certificate directory.
 * @property {string} [keyFileName="privkey.pem"] - Private key filename.
 * @property {string} [chainFileName="fullchain.pem"] - Certificate chain filename.
 */

/**
 * Reads certificate and key files for a given domain and creates a TLS secure context.
 * Returns a tuple `[domainName, context]` or `false` if the context could not be created.
 *
 * @param {DomainContextOptions} opts
 * @returns {Promise<[string, tls.SecureContext] | false>}
 */
const getDomainContext = async ({
  certDir,
  host,
  domain,
  keyFileName = 'privkey.pem',
  chainFileName = 'fullchain.pem',
}) => {
  if (domain === certDir) {
    return false
  }

  const name = path.basename(domain)

  try {
    const chainFile = path.join(domain, chainFileName)
    const keyFile = path.join(domain, keyFileName)

    /** @type {tls.SecureContextOptions & { ca?: Buffer }} */
    const args = {
      cert: await fs.readFile(chainFile),
      key: await fs.readFile(keyFile),
    }

    if (process.env.NODE_ENV === 'development' && host === 'localhost') {
      const caFile = path.join(domain, 'cert.pem')
      args.ca = await fs.readFile(caFile)
    }

    // createSecureContext returns { context: SecureContext }
    const { context } = tls.createSecureContext(args)

    return [name, context]
  } catch (e) {
    const err = /** @type {import('@magic/error').CustomError} */ (e)
    log.server.error(err)
    return false
  }
}

/**
 * Creates an object mapping domain names to their TLS SecureContext.
 * Used by the HTTPS server’s SNICallback.
 *
 * @param {{ certDir: string, host: string, keyFileName?: string, chainFileName?: string }} args
 * @returns {Promise<Record<string, tls.SecureContext>>}
 */
export const createSecureContext = async args => {
  const { certDir, host, keyFileName, chainFileName } = args

  // find all directories in certDir
  const availableCertificates = await fs.getDirectories(certDir, { noRoot: true })

  // load each domain context asynchronously
  const certificatePromises = availableCertificates.map(domain =>
    getDomainContext({ certDir, host, domain, keyFileName, chainFileName }),
  )

  const contextArray = await Promise.all(certificatePromises)

  // filter out failed contexts
  /** @type {[string, tls.SecureContext][]} */
  const validContexts = /** @type {any} */ (contextArray.filter(Boolean))

  // map domains to SecureContext objects
  const secureContext = Object.fromEntries(validContexts)

  return secureContext
}
