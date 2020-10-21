import fs from '@magic/fs'

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