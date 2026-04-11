/** Escape a CSV field; wrap in quotes if needed. */
export function escapeCsvField(value: string | null | undefined): string {
  if (value == null || value === "") return "";
  const escaped = String(value).replace(/"/g, '""');
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function clicksRowToCsvLine(row: {
  link_id: string;
  clicked_at: string;
  referrer: string | null;
  user_agent: string | null;
}): string {
  return [
    row.link_id,
    row.clicked_at,
    escapeCsvField(row.referrer),
    escapeCsvField(row.user_agent),
  ].join(",");
}
