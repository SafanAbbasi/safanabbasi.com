/**
 * Keys must match `links.icon` in the database and `LinkButton`’s icon map.
 * Used for admin hints and safe lookups.
 */
export const KNOWN_LINK_ICON_KEYS = [
  "Code",
  "Briefcase",
  "Globe",
  "FileText",
  "Rocket",
] as const;

export type KnownLinkIconKey = (typeof KNOWN_LINK_ICON_KEYS)[number];

export function isKnownLinkIconKey(
  value: string | null | undefined
): value is KnownLinkIconKey {
  return (
    value != null &&
    (KNOWN_LINK_ICON_KEYS as readonly string[]).includes(value)
  );
}
