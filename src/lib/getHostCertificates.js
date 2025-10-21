import path from 'path'

import fs from '@magic/fs'

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
