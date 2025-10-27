import path from 'node:path'

import fs from '@magic/fs'
import constants from '@magic/http1-constants'

import log from '../log.js'

const { CONTENT_ENCODING, CONTENT_LENGTH, CONTENT_TYPE } = constants.headers

/**
 *
 * @param {object} args
 * @param {string} [args.url]
 * @param {string | false} [args.favicon]
 * @returns {boolean}
 */
export const shouldServeFavicon = ({ url, favicon }) => !!url && !!favicon && url === `/${favicon}`

/**
 *
 * @param {string | false} favicon
 * @param {string} [dir='src/static']
 * @returns {Promise<{ body: Buffer, headers: Record<string, string|number> } | undefined>}
 */
export const getFaviconContent = async (favicon, dir = path.join('src', 'static')) => {
  if (!favicon) {
    return
  }

  const staticDir = path.join(process.cwd(), dir)

  try {
    // Try the compressed version first (.gz)
    const compressedFaviconPath = path.join(staticDir, `${favicon}.gz`)

    const body = await fs.readFile(compressedFaviconPath)

    return {
      body,
      headers: {
        [CONTENT_TYPE]: 'image/x-icon',
        [CONTENT_ENCODING]: 'gzip',
        [CONTENT_LENGTH]: body.byteLength,
      },
    }
  } catch {}

  try {
    // Fallback to uncompressed favicon
    const faviconPath = path.join(staticDir, favicon)
    const exists = await fs.exists(faviconPath)

    if (exists) {
      const body = await fs.readFile(faviconPath)

      return {
        body,
        headers: {
          [CONTENT_TYPE]: 'image/x-icon',
          [CONTENT_LENGTH]: body.byteLength,
        },
      }
    }

    // If neither file exists, do nothing
    return
  } catch (e) {
    log.server.error(e)
    return
  }
}
