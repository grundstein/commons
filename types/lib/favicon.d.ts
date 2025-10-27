export function shouldServeFavicon({
  url,
  favicon,
}: {
  url?: string | undefined
  favicon?: string | false | undefined
}): boolean
export function getFaviconContent(
  favicon: string | false,
  dir?: string,
): Promise<
  | {
      body: Buffer
      headers: Record<string, string | number>
    }
  | undefined
>
