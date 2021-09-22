import log from '../log.mjs'

export const enhanceRequest = req => {
  req.startTime = log.hrtime()

  return req
}
