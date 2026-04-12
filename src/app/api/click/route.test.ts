import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockMaybeSingle = vi.fn().mockResolvedValue({ data: { id: "github" } });

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: mockMaybeSingle,
        }),
      }),
      insert: mockInsert,
    })),
  })),
  createServiceSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    })),
  })),
}));

import { POST } from "./route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/click", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
    mockMaybeSingle.mockResolvedValue({ data: { id: "github" } });
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid json/i);
  });

  it("returns 400 for missing linkId", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-string linkId", async () => {
    const res = await POST(makeRequest({ linkId: 123 }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty linkId", async () => {
    const res = await POST(makeRequest({ linkId: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for linkId exceeding max length", async () => {
    const res = await POST(makeRequest({ linkId: "a".repeat(513) }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for unknown link", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    const res = await POST(makeRequest({ linkId: "nonexistent" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid link/i);
  });

  it("returns 200 and inserts click for valid link", async () => {
    const res = await POST(makeRequest({ linkId: "github" }));
    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalled();
  });
});
