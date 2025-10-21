export function getEtagKeyFromFilePath({ dir, file }: FilePathInfo): string
export function getEtag({ dir, cache }: EtagConfig): (arg0: EtagFileInfo) => string
export function etags(dir: string): Promise<(arg0: EtagFileInfo) => string>
export type Stats = import('fs').Stats
export type EtagFileInfo = {
  /**
   * - File path
   */
  file: string
  /**
   * - File stats object
   */
  stat: Stats
}
export type EtagConfig = {
  /**
   * - Directory path
   */
  dir: string
  /**
   * - ETag cache object
   */
  cache?:
    | {
        [x: string]: string
      }
    | undefined
}
export type FilePathInfo = {
  /**
   * - Directory path
   */
  dir: string
  /**
   * - File path
   */
  file: string
}
