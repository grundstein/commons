export function listener({
  startTime,
  host,
  port,
}: {
  startTime: ReturnType<typeof process.hrtime>
  host: string
  port: number
}): () => void
