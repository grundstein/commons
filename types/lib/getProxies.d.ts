export function getProxies(config: ProxyConfig): Promise<string[]>
export type ProxyConfig = {
  /**
   * - Path to proxy file
   */
  proxyFile: string
}
