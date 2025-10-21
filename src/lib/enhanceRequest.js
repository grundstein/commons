import log from '../log.js'

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 */

/** @typedef {IncomingMessage & {startTime: [number, number]}} Message */

/**
 * Enhances request object with startTime property
 * @param {Message} [req] - HTTP request object
 * @returns {Message} Enhanced request object
 */
export const enhanceRequest = req => {
  req = req || /** @type {Message} */ ({})
  req.startTime = log.hrtime()

  return req
}
