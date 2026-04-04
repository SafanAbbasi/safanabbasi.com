import { NextRequest } from "next/server";
import { Resend } from "resend";
import { createAuthSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin is authenticated
  const supabase = await createAuthSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { reply } = await request.json();

  if (!reply || typeof reply !== "string" || reply.trim().length === 0) {
    return Response.json({ error: "Reply message is required" }, { status: 400 });
  }

  if (reply.length > 5000) {
    return Response.json({ error: "Reply too long" }, { status: 400 });
  }

  // Fetch the original message
  const { data: message, error: fetchError } = await supabase
    .from("messages")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (fetchError || !message) {
    return Response.json({ error: "Message not found" }, { status: 404 });
  }

  // Validate stored email before sending
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(message.email)) {
    return Response.json({ error: "Invalid recipient email" }, { status: 400 });
  }

  // Send email via Resend
  const resend = getResend();
  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: message.email,
    subject: `Re: Your message on safanabbasi.com`,
    replyTo: "safan.a.abbasi@gmail.com",
    text: `Hi ${message.name},\n\n${reply.trim()}\n\n—\nSafan Abbasi\nhttps://www.safanabbasi.com`,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  // Mark message as replied
  await supabase
    .from("messages")
    .update({ replied_at: new Date().toISOString() })
    .eq("id", Number(id));

  return Response.json({ success: true });
}
