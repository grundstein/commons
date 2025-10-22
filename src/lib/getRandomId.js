import crypto from 'crypto'

import log from '../log.js'

const getNumericRandomId = (byteLength = 12) => {
  const nums = []
  for (let i = 0; i < byteLength * 2; i++) {
    let num = Math.floor(Math.random() * 9.999)
    nums.push(num)
  }

  return nums.join('')
}

/**
 * Generates a random ID using crypto.randomBytes
 * Falls back to Math.random if crypto fails
 * @param {number} [byteLength=12]
 * @param {(byteLength: number, callback: (err: Error | null, buf: Buffer<ArrayBufferLike>) => void) => void} randomBytes
 *
 * @returns {Promise<string>} Random hex string or numeric ID
 */
export const getRandomId = (byteLength = 12, randomBytes = crypto.randomBytes) =>
  new Promise(resolve => {
    if (!randomBytes) {
      resolve(getNumericRandomId())
    }

    randomBytes(byteLength, (err, buffer) => {
      // something went wrong with /dev/urandom.
      // lets generate a simple numeric id.
      // this has a higher risk of id clashes in our logs,
      // but at least the progress won't die on us.
      if (err || !buffer) {
        const id = getNumericRandomId()
        log.server.error(err)
        resolve(id)
        return
      }

      resolve(buffer.toString('hex'))
    })
  })
