export const getHostname = r => {
  const hostname = r.hostname || r.headers['x-forwarded-host'] || r.headers.host || ''

  if (hostname.includes(':')) {
    return hostname.split(':')
  }

  return hostname
}
