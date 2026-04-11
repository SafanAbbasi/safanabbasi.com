export const REDIRECT_CLICK_PREFIX = "redirect:" as const;

const MAX_LINK_ID_LEN = 512;

/**
 * If `linkId` encodes a short-link click (`redirect:<slug>`), returns the slug; otherwise null.
 */
export function parseRedirectClickSlug(linkId: string): string | null {
  if (!linkId.startsWith(REDIRECT_CLICK_PREFIX)) {
    return null;
  }
  const slug = linkId.slice(REDIRECT_CLICK_PREFIX.length).trim();
  if (!slug || slug.length > MAX_LINK_ID_LEN) {
    return null;
  }
  return slug;
}

export function isValidLinkIdShape(linkId: unknown): linkId is string {
  return (
    typeof linkId === "string" &&
    linkId.length > 0 &&
    linkId.length <= MAX_LINK_ID_LEN
  );
}
