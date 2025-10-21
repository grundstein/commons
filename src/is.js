import net from 'net'

import types from '@magic/types'

/**
 * Checks if value is a valid IP address (v4 or v6)
 * @param {any} a - Value to check
 * @returns {boolean}
 */
export const ip = a => net.isIP(a) > 0

/**
 * Checks if value is a valid IPv4 address
 * @param {any} a - Value to check
 * @returns {boolean}
 */
ip.v4 = a => net.isIP(a) === 4

/**
 * Checks if value is a valid IPv6 address
 * @param {any} a - Value to check
 * @returns {boolean}
 */
ip.v6 = a => net.isIP(a) === 6

export const is = {
  ...types,
  ip,
}
