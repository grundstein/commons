import { createReadStream } from 'fs'

export const sendStream = (req, res, options) => {
  const { file, headers = {} } = options
  const { range } = req.headers

  let statusCode = 200

  let start = 0
  let end = file.size - 1

  if (!range) {
    headers['Content-Length'] = file.size
    headers['Content-Type'] = file.mime
    headers['Accept-Ranges'] = 'bytes'
  } else {
    statusCode = 206

    const [startByte, endByte] = range.replace(/bytes=/, '').split('-')
    start = parseInt(startByte, 10)
    end = endByte ? parseInt(endByte, 10) : file.size - 1

    if (start >= file.size) {
      const errorString = `Requested range not satisfiable ${start} >= ${file.size}`
      const errorBuffer = Buffer.from(errorString)
      headers['Content-Type'] = 'text/plain'
      headers['Content-Length'] = Buffer.byteLength(errorBuffer)

      res.writeHead(416, headers)
      res.end(errorMessage)
      return
    }


    const chunksize = end - start + 1

    headers['Content-Range'] = `bytes ${start}-${end}/${file.size}`
    headers['Accept-Ranges'] = 'bytes'
    headers['Content-Length'] = chunksize
    headers['Content-Type'] = file.mime
  }

  res.writeHead(statusCode, headers)

  const readStream = createReadStream(file.path, { start, end })
  readStream.setEncoding('utf8')

  readStream.on('open', () => {
    readStream.pipe(res)
  })

  readStream.on('error', err => {
    res.end(err)
  })
}
