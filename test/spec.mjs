import { is } from '@magic/test'

import types from '@magic/types'

import magicLog from '@magic/log'

import { log, lib, middleware, is as libIs } from '../src/index.mjs'

import * as exportedLib from '../lib.mjs'
import * as exportedMiddleware from '../middleware.mjs'

export default [
  { fn: is.deep.equal(log, magicLog), info: 'log equals @magic/log' },

  { fn: is.object(lib), info: 'lib is an object' },
  { fn: is.fn(lib.formatLog), info: 'lib.formatLog is a function' },
  { fn: is.fn(lib.getFileEncoding), info: 'lib.getFileEncoding is a function' },
  { fn: is.fn(lib.getRandomId), info: 'lib.getRandomId is a function' },
  { fn: is.fn(lib.respond), info: 'lib.respond is a function' },
  { fn: is.fn(lib.sendFile), info: 'lib.sendFile is a function' },

  { fn: is.object(middleware), info: 'middleware is an object' },
  { fn: is.fn(middleware.body), info: 'middleware.body is a function' },

  { fn: is.deep.equal(exportedLib, lib), info: 'exported libs are equal' },
  { fn: is.deep.equal(exportedMiddleware, middleware), info: 'exported middlewares are equal' },

  { fn: is.deep.equal(libIs, types), info: '@magic/types and this library export the same default' },
]
