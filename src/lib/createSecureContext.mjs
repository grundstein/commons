import path from 'path'
import tls from 'tls'

import { log } from '../log.mjs'

import fs from '@magic/fs'

/*
 * TODO: rewrite this function in a memory-managing language
 * to make sure we can instantly forget the contents of the secret files.
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

    const args = {
      cert: await fs.readFile(chainFile),
      key: await fs.readFile(keyFile),
    }

    if (process.env.NODE_ENV === 'development' && host === 'localhost') {
      const caFile = path.join(domain, 'cert.pem')
      args.ca = await fs.readFile(caFile)
    }

    const { context } = tls.createSecureContext(args)

    return [name, context]
  } catch (e) {
    log.server.error(e)
  }
}

export const createSecureContext = async args => {
  const { certDir, host } = args

  /*
   * find directories in certDir
   */
  const availableCertificates = await fs.getDirectories(certDir, { noRoot: true })

  /*
   * create a list of certificates to map over and make available
   */
  const certificatePromises = availableCertificates.map(domain =>
    getDomainContext({ certDir, host, domain }),
  )
  const contextArray = await Promise.all(certificatePromises)

  /*
   * this object has a key for each domain found above
   * the createServer function will register a SNICallback
   * that checks this object for context based on hostnames
   */
  const secureContext = Object.fromEntries(contextArray)

  return secureContext
}
