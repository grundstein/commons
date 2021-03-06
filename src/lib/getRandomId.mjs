import crypto from 'crypto'

import log from '../log.mjs'

export const getRandomId = () =>
  new Promise(resolve =>
    crypto.randomBytes(12, (err, buffer) => {
      // something went wrong with /dev/urandom.
      // lets generate a simple numeric id.
      // this has a higher risk of id clashes in our logs,
      // but at least the progress won't die on us.
      if (err || !buffer) {
        const id = Math.floor(Math.Random() * 1000000)
        log.server.error(err)
        resolve(id)
        return
      }

      resolve(buffer.toString('hex'))
    }),
  )
