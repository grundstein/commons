import { createReadStream } from 'fs'

export const sendStream = (req, res, options) => {
  const { file, code = 200, type = 'sendFile' } = options
  let { headers = {} } = options

  const { range } = req.headers

  if (range) {
    const [startByte, endByte] = range.replace(/bytes=/, '').split('-')
    const start = parseInt(startByte, 10)
    const end = endByte ? parseInt(endByte, 10) : file.size - 1

    if (start >= file.size) {
      res.status(416).send(`Requested range not satisfiable ${start} >= ${file.size}`)
      return
    }

    const chunksize = end - start + 1
    const fileStream = createReadStream(file.path, { start, end })

    headers['Content-Range'] = `bytes ${start}-${end}/${file.size}`
    headers['Accept-Ranges'] = 'bytes'
    headers['Content-Length'] = chunksize
    headers['Content-Type'] = file.mime

    res.writeHead(206, headers)
    fileStream.pipe(res)
  } else {
    headers['Content-Length'] = file.size
    headers['Content-Type'] = file.mime

    res.writeHead(200, headers)
    createReadStream(file.path).pipe(res)
  }
}
