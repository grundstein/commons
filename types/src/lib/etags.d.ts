export function getEtagKeyFromFilePath({ dir, file }: { dir: string; file: string }): string
export function getEtag({ dir, cache }: EtagOptions): (arg: FilePath) => string
export function etags(dir: string): Promise<(arg: FilePath) => string>
export type FileStat = {
  size: number
  mtimeMs: number
}
export type EtagOptions = {
  /**
   * - Base directory
   */
  dir: string
  /**
   * - Optional cache object
   */
  cache?: Record<string, string> | undefined
}
export type FilePath = {
  /**
   * - Full file path
   */
  file: string
  /**
   * - File stat object
   */
  stat: FileStat
}
