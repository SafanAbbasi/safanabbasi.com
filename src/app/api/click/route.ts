import { NextRequest, NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";
import {
  isValidLinkIdShape,
  parseRedirectClickSlug,
} from "@/lib/click-validation";

async function isAllowedClickInsert(linkId: string): Promise<boolean> {
  const redirectSlug = parseRedirectClickSlug(linkId);
  if (redirectSlug) {
    const service = createServiceSupabaseClient();
    if (!service) {
      return false;
    }
    const { data } = await service
      .from("redirects")
      .select("slug")
      .eq("slug", redirectSlug)
      .maybeSingle();
    return !!data;
  }

  const anon = createServerSupabaseClient();
  const { data } = await anon
    .from("links")
    .select("id")
    .eq("id", linkId)
    .maybeSingle();
  return !!data;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const linkId =
    typeof body === "object" &&
    body !== null &&
    "linkId" in body &&
    (body as { linkId: unknown }).linkId !== undefined
      ? (body as { linkId: unknown }).linkId
      : undefined;

  if (!isValidLinkIdShape(linkId)) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }

  if (!(await isAllowedClickInsert(linkId))) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("clicks").insert({
    link_id: linkId,
    referrer: request.headers.get("referer") || null,
    user_agent: request.headers.get("user-agent") || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
