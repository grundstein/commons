import log from '../log.js'

export const enhanceRequest = (stream = {}) => {
  stream.startTime = log.hrtime()

  return stream
}
