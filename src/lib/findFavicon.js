import http2 from 'node:http2'
import path from 'node:path'

import fs from '@magic/fs'

const { constants } = http2

export const findFavicon = async () => {
  const srcDir = path.join(process.cwd(), 'src')
  const favName = 'favicon.ico'

  const paths = [
    path.join(srcDir, favName),
    path.join(srcDir, 'static', favName),
    path.join(srcDir, 'assets', 'static', favName),
    path.join('.', 'src', 'static', favName),
  ]

  let faviconContent

  for (let i = 0; i < paths.length; i++) {
    const p = paths[i]

    try {
      faviconContent = await fs.readFile(p)
      /*
       * We found a favicon, lets break the loop
       */
      break
    } catch (e) {
      const err = /** @type {import('@magic/error').CustomError} */ (e)
      if (err.code !== 'ENOENT') {
        throw err
      }

      faviconContent = undefined
    }
  }

  if (faviconContent) {
    return {
      code: 200,
      body: faviconContent,
      headers: {
        [constants.HTTP2_HEADER_CONTENT_TYPE]: 'image/vnd.microsoft.icon',
      },
    }
  }

  return false
}
