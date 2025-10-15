export function createSecureContext(args: {
  certDir: string
  host: string
  keyFileName?: string
  chainFileName?: string
}): Promise<Record<string, tls.SecureContext>>
export type DomainContextOptions = {
  /**
   * - Base directory containing certificates.
   */
  certDir: string
  /**
   * - Hostname of the current server (e.g. "example.com" or "localhost").
   */
  host: string
  /**
   * - Path or folder name of the domain’s certificate directory.
   */
  domain: string
  /**
   * - Private key filename.
   */
  keyFileName?: string | undefined
  /**
   * - Certificate chain filename.
   */
  chainFileName?: string | undefined
}
import tls from 'node:tls'
