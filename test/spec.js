import { is, version } from '@magic/test'

import { lib, middleware } from '../src/index.js'

import * as exportedLib from '../src/lib.js'
import * as exportedMiddleware from '../src/middleware.js'

const spec = {
  formatLog: 'function',
  getFileEncoding: 'function',
  getRandomId: 'function',
  respond: 'function',
  sendFile: 'function',
  middleware: {
    body: 'function',
  },
  addEnv: 'function',
  anyToLowerCase: 'function',
  cleanIpAddress: 'function',
  etags: 'function',
  createServer: 'function',
  createServerHTTP1: 'function',
  createSecureContext: 'function',
  denyRequest: 'function',
  enhanceRequest: 'function',
  getClientIp: 'function',
  getCurrentDate: 'function',
  getHostCertificates: 'function',
  getHostname: 'function',
  getProxies: 'function',
  getRequestDuration: 'function',
  isSendableFile: 'function',
  slugify: 'function',
}

const middlewareSpec = {
  body: 'function',
  listener: 'function',
  clientError: 'function',
}

export default [
  ...version(lib, spec),
  ...version(middleware, middlewareSpec),
  {
    fn: exportedLib,
    expect: is.deep.equal(lib),
    info: 'exported lib and lib are the same',
  },
  {
    fn: exportedMiddleware,
    expect: is.deep.equal(middleware),
    info: 'exported middleware and middleware are the same',
  },
]
