import path from 'node:path'

import fs from '@magic/fs'

export const findFavicon = async () => {
  const localFaviconPath = path.join(process.cwd(), 'src', 'favicon.ico')
  const localFaviconExists = await fs.exists(localFaviconPath)

  const localStaticFaviconPath = path.join(process.cwd(), 'src', 'static', 'favicon.ico')
  const localStaticFaviconExists = await fs.exists(localStaticFaviconPath)

  const defaultFaviconPath = path.join('.', 'src', 'favicon.ico')
  const defaultFaviconExists = await fs.exists(defaultFaviconPath)

  let faviconPath
  if (localFaviconExists) {
    faviconPath = localFaviconPath
  } else if (localStaticFaviconExists) {
    faviconPath = localStaticFaviconPath
  } else if (defaultFaviconExists) {
    faviconPath = defaultFaviconPath
  }

  if (faviconPath) {
    const faviconContent = await fs.readFile(faviconPath)

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