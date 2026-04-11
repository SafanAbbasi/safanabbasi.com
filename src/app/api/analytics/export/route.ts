import { NextResponse } from "next/server";
import { clicksRowToCsvLine } from "@/lib/csv";
import { createAuthSupabaseClient } from "@/lib/supabase/server";

const PAGE_SIZE = 2000;

export async function GET() {
  const supabase = await createAuthSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const header = "link_id,clicked_at,referrer,user_agent";
  const lines: string[] = [header];
  let offset = 0;

  while (true) {
    const { data: batch, error } = await supabase
      .from("clicks")
      .select("link_id, clicked_at, referrer, user_agent")
      .order("clicked_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!batch?.length) {
      break;
    }

    for (const row of batch) {
      lines.push(clicksRowToCsvLine(row));
    }

    if (batch.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  if (lines.length <= 1) {
    return new NextResponse("No data to export", { status: 404 });
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="linkpage-clicks-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
