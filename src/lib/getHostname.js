export const getHostname = req => {
  const { headers, hostname } = req
  const host = headers.host || headers['x-forwarded-for'] || hostname || ''

  if (host.includes(':')) {
    return host.split(':')[0]
  }

  return host
}
