export function getFileEncoding(
  file: import('./sendFile.js').FileDescriptor,
  acceptEncoding?: string[] | string,
): 'buffer' | 'br' | 'gzip' | 'deflate'
