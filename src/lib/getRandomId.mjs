import crypto from 'crypto'

import log from '@magic/log'

export const getRandomId = () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(12, (err, buffer) => {
      // something went wrong with /dev/urandom.
      // lets generate a simple numeric id.
      // this has a higher risk of id clashes in our logs,
      // but at least the progress won't die on us.
      if (err) {
        const id = Math.floor(Math.Random() * 1000000)
        log.error(err)
        resolve(id)
        return
      }

      resolve(buffer.toString('hex'))
    }),
  )
