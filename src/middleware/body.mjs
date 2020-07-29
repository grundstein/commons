// this middleware expects small chunks of data.
// it loads the full request body into ram before returning.
// request body size limits should be set in this middleware in the future.

export const body = req =>
  new Promise((resolve, reject) => {
    try {
      const isJson = req.headers['content-type'] === 'application/json'

      const bodyParts = []

      req.on('data', chunk => {
        bodyParts.push(chunk)
      })

      req.on('end', () => {
        let body = Buffer.concat(bodyParts).toString()

        if (isJson) {
          try {
            body = JSON.parse(body)
          } catch (e) {
            log.server.error(e)
            reject(e)
            return
          }
        }

        resolve(body)
      })

      req.on('error', reject)
    } catch (e) {
      return e
    }
  })
