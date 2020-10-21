export const getHostname = req => {
  const { headers, hostname } = req
  const host = headers['x-forwarded-for'] || hostname || headers.host || ''

  if (host.includes(':')) {
    return host.split(':')[0]
  }

  return host
}
