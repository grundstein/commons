import { is } from '@magic/types'

export const denyRequest = (req = {}) => {
  const { url = '', socket } = req

  /*
   * if the req.url does not exist, start with '/' or includes '://',
   * something fishy is going on for sure,
   * let's catch that case and do nothing in response.
   */
  if (is.empty(url) || !url.startsWith('/') || url.includes('://')) {
    /*
     * disconnect from the client.
     */
    if (is.fn(socket?.destroy)) {
      socket.destroy()
    }

    /*
     * Make sure we return here,
     * this keeps everyone else's requests serve fine
     * even if this function is hammered and the cpu is at 100%.
     */
    return true
  }

  /*
   * all seems fine, continue with the request/response cycle
   */
  return false
}
