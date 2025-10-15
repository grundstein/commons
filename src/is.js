import net from 'node:net'
import types from '@magic/types'

/**
 * A function that checks if a string is an IP address.
 * @typedef {(a: unknown) => boolean} IpCheck
 */

export const is = types

/** @type {IpCheck} */
export const isIp = a => is.string(a) && net.isIP(a) > 0
/** @type {IpCheck} */
export const isIpV4 = a => is.string(a) && net.isIPv4(a)
/** @type {IpCheck} */
export const isIpV6 = a => is.string(a) && net.isIPv6(a)
