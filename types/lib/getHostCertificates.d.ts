export function getHostCertificates(config: CertificateConfig): Promise<HostCertificates>
export type CertificateConfig = {
  /**
   * - Hostname
   */
  host: string
  /**
   * - Certificate directory path
   */
  certDir: string
}
export type HostCertificates = {
  /**
   * - Private key buffer
   */
  key: Buffer
  /**
   * - Certificate buffer
   */
  cert: Buffer
  /**
   * - CA certificate buffer
   */
  ca: Buffer
}
