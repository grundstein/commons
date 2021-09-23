export const getClientIp = (req = {}, full = false) => {
  const { connection = {}, headers = {} } = req

  const ip = headers['x-forwarded-for']
    ? headers['x-forwarded-for'].split(',')[0]
    : connection.remoteAddress

  let splitter = '.'

  if (!ip) {
    return 'unknown'
  }

  if (full) {
    return ip
  }

  if (ip.includes(':') && !ip.includes('.')) {
    splitter = ':'
  }

  const ipArray = ip.split(splitter)
  // remove last part of ip address
  ipArray.pop()

  const ipString = ipArray.join(splitter)

  return `${ipString}${splitter}xxx`
}
