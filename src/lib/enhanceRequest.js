import log from '../log.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 */

/** @typedef {IncomingMessage & {startTime: [number, number]}} Message */

/**
 * Enhances request object with startTime property
 * @param {IncomingMessage} [req] - HTTP request object
 * @returns {Message} Enhanced request object
 */
export const enhanceRequest = req => {
  req = req || /** @type {Message} */ ({})
  const startTime = log.hrtime()

  return Object.assign(req, { startTime })
}
