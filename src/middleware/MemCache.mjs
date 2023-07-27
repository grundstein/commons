import is from '@magic/types'
import os from 'os'

const oneMegaByte = 1024 * 1024
const hundredMegaBytes = oneMegaByte * 100

export class MemCache {
  constructor() {
    this.data = {}
  }

  get(key) {
    return this.data[key]
  }

  set(key, val) {
    if (!is.buffer(val)) {
      try {
        val = Buffer.from(val)
      } catch (e) {
        log.error(e)
        return false
      }
    }

    const osFreeMem = os.freemem()
    // get free memory in bytes, roughly what our val.length equals too.
    const allFreeMem = (osFreeMem / 1024)

    // make sure we both have val.length * 5 and more than 100 mb of free ram
    // before adding a key <> value pair
    if (allFreeMem > val.length && allFreeMem > hundredMegaBytes) {
      this.data[key] = val
      return true
    }

    return false
  }
}