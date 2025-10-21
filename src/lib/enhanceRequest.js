import log from '../log.js'

export const enhanceRequest = (req = {}) => {
  req.startTime = log.hrtime()

  return req
}
