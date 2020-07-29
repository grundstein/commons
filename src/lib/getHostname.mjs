export const getHostname = req => {
  const { headers, hostname } = req
  const host = hostname || headers['x-forwarded-host'] || headers.host || ''

  if (host.includes(':')) {
    return host.split(':')[0]
  }

  return host
}
