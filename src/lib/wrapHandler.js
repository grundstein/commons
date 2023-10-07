import { denyRequest } from './denyRequest.js'
import { findFavicon } from './findFavicon.js'
import { respond } from './respond.js'

export const wrapHandler = async ({ faviconContent, flags, handler, headers, stream }) => {
  if (!handler) {
    return
  }

  const faviconContent = await findFavicon()

  const pathname = headers[constants.HTTP2_HEADER_PATH]

  if (faviconContent && pathname === '/favicon.ico') {
    return respond(stream, headers, faviconContent)
  }

  if (denyRequest(stream, headers, flags)) {
    return
  }

  return handler(stream, headers, flags)
}
