export const getHostname = headers => {
  const authority = headers['x-forwarded-for'] || headers[':authority'] || headers.host

  if (authority.includes(':')) {
    return authority.split(':')[0]
  }

  return authority
}
