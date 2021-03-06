import { createReadStream } from 'fs'

export const sendStream = (req, res, options) => {
  const { file, headers = {} } = options
  const { range } = req.headers

  let statusCode = 200

  let start = 0
  let end = file.size - 1

  // if (file.mime === 'application/javascript' || file.mime === 'application/css') {
  //   file.mime = file.mime.replace('application', 'text')
  // }

  if (range) {
    const [startByte, endByte] = range.replace(/bytes=/, '').split('-')
    start = parseInt(startByte, 10)
    end = endByte ? parseInt(endByte, 10) : file.size - 1

    statusCode = 206
  }

  if (start >= file.size) {
    const errorMessage = `Requested range not satisfiable ${start} >= ${file.size}`
    const errorBuffer = Buffer.from(errorMessage)

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

  // if (end <= file.size - 1) {
  //   // reset cache headers, this is a video and can not be cached
  //   headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
  //   headers['Pragma'] = 'no-cache'
  //   headers['Expires'] = 0
  // }

  res.writeHead(statusCode, headers)

  const readStream = createReadStream(file.path, { start, end })

  readStream.pipe(res)

  res.on('close', () => {
    if (res.readStream) {
      res.readStream.unpipe(readStream)
      if (readStream.fd) {
        fs.close(readStream.fd)
      }
    }
  })
}
