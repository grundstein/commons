import { log } from '../log.mjs'
import { getRandomId } from './getRandomId.mjs'

export const enhanceRequest = async req => {
  req.startTime = log.hrtime()

  // assign random id to make this call traceable in logs.
  req.id = await getRandomId()

  return req
}
