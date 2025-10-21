import fs from '@magic/fs'

/**
 * @typedef {Object} ProxyConfig
 * @property {string} proxyFile - Path to proxy file
 */

/**
 * Reads proxy addresses from a file
 * Each proxy should be on a separate line
 * Returns empty array if file doesn't exist or on error
 * @param {ProxyConfig} config - Configuration with proxy file path
 * @returns {Promise<string[]>} Array of proxy addresses
 */
export const getProxies = async config => {
  try {
    const proxyFileContents = await fs.readFile(config.proxyFile, 'utf8')

    /* read proxies, delimited by newlines, filter out empty lines */
    const proxies = proxyFileContents.split('\n').filter(a => a)
    return proxies
  } catch (e) {
    /* on error, we expect that no proxies exist */
    return []
  }
}
