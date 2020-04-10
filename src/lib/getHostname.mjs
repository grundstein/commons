export const getHostname = r => r.hostname || r.headers['x-forwarded-host'] || r.headers.host || ''
