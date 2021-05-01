const getIpPart = () => Math.floor(Math.random() * 256)

export const getClientIp = (req, full = false) => {
  const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0]
    : req.connection.remoteAddress

  let splitter = '.'

  if (!ip) {
    return `${getIpPart()}.${getIpPart()}.${getIpPart()}.235`
  }

  if (full) {
    return ip
  }

  if (ip.includes(':') && !ip.includes('.')) {
    splitter = ':'
  }

  const ipArray = ip.split(splitter)
  ipArray.pop()

  return `${ipArray.join(splitter)}${splitter}${splitter === '.' && '235'}`
}
