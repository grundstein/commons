export function createSecureContext(certDir: string): Promise<{
  [x: string]: SecureContext
}>
export type SecureContext = import('tls').SecureContext
