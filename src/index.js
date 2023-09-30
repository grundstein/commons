import http2 from 'node:http2'

export const constants = http2.constants

export { default as fs } from '@magic/fs'
export { default as cli } from '@magic/cli'
export { default as error } from '@magic/error'

export { default as log } from './log.js'
export { default as fileLog } from './fileLog.js'

export { is } from './is.js'

export * as lib from './lib/index.js'
export * as middleware from './middleware/index.js'
