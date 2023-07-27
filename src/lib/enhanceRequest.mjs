import log from '../log.mjs'

export const enhanceRequest = (stream = {}) => {
  stream.startTime = log.hrtime()

  return stream
}
