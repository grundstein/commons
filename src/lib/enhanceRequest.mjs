import log from '../log.mjs'
import { getRandomId } from './getRandomId.mjs'

export const enhanceRequest = req => {
  req.startTime = log.hrtime()

  return req
}
