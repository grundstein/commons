import path from 'node:path'
import { fs, is, tryCatch } from '@magic/test'

import { getHostCertificates } from '../../src/lib/getHostCertificates.js'

const certDir = path.join(process.cwd(), 'test', '.certs')

const keyFile = path.join(certDir, 'private', 'local.host.key.pem')
const certFile = path.join(certDir, 'certs', 'local.host.cert.pem')
const caCertFile = path.join(certDir, 'certs', 'intermediate.cert.pem')

const before = async () => {
  await fs.mkdirp(certDir)
  await fs.mkdirp(path.join(certDir, 'private'))
  await fs.mkdirp(path.join(certDir, 'certs'))

  await fs.writeFile(keyFile, 'keyFile')
  await fs.writeFile(certFile, 'certFile')
  await fs.writeFile(caCertFile, 'caFile')

  return async () => {
    await fs.rmrf(certDir)
  }
}

export default [
  {
    fn: tryCatch(getHostCertificates),
    expect: is.error,
    info: 'getHostCertificates without arguments throws',
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir: '/does/not/exist' }),
    expect: is.error,
    info: 'getHostCertificates with invalid certDir throws',
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir }),
    expect: is.error,
    info: 'getHostCertificates with valid arguments but missing files throws',
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir }),
    expect: t => t.code === 'ENOENT',
    info: 'getHostCertificates with valid arguments but missing files throws with ENOENT',
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir }),
    expect: t =>
      is.objectNative(t) &&
      t.key.toString() === 'keyFile' &&
      t.cert.toString() === 'certFile' &&
      t.ca.toString() === 'caFile',
    info: 'getHostCertificates with valid arguments and existing files returns contents',
    before,
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir }),
    expect: t => t.key.toString() === 'keyFile',
    info: 'getHostCertificates with valid arguments and existing files returns correct key contents',
    before,
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir }),
    expect: t => t.cert.toString() === 'certFile',
    info: 'getHostCertificates with valid arguments and existing files returns correct cert contents',
    before,
  },
  {
    fn: tryCatch(getHostCertificates, { host: 'local.host', certDir }),
    expect: t => t.ca.toString() === 'caFile',
    info: 'getHostCertificates with valid arguments and existing files returns correct ca contents',
    before,
  },
]
