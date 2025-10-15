export function getHostCertificates(config: { host: string; certDir: string }): Promise<{
  key: Buffer
  cert: Buffer
  ca: Buffer
}>
