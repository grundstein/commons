import path from 'path'

import fs from '@magic/fs'

/**
 * @typedef {Object} CertificateConfig
 * @property {string} host - Hostname
 * @property {string} certDir - Certificate directory path
 */

/**
 * @typedef {Object} HostCertificates
 * @property {Buffer} key - Private key buffer
 * @property {Buffer} cert - Certificate buffer
 * @property {Buffer} ca - CA certificate buffer
 */

/**
 * Reads SSL/TLS certificates for a specific host
 * Loads private key, certificate, and intermediate CA certificate
 * @param {CertificateConfig} config - Configuration with host and cert directory
 * @returns {Promise<HostCertificates>} Object containing key, cert, and CA buffers
 */
export const getHostCertificates = async config => {
  const { host, certDir } = config

  const keyFile = path.join(certDir, 'private', `${host}.key.pem`)
  const certFile = path.join(certDir, 'certs', `${host}.cert.pem`)
  const caCertFile = path.join(certDir, 'certs', 'intermediate.cert.pem')

  return {
    key: await fs.readFile(keyFile),
    cert: await fs.readFile(certFile),
    ca: await fs.readFile(caCertFile),
  }
}
