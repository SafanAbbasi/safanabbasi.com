import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase before importing the route
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    gte: vi.fn().mockResolvedValue({ count: 0 }),
  }),
});

vi.mock("@/lib/supabase/server", () => ({
  createServiceSupabaseClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "messages") {
        return {
          select: mockSelect,
          insert: mockInsert,
        };
      }
      return {};
    }),
  })),
}));

import { POST } from "./route";

function makeRequest(body: Record<string, unknown>, ip = "1.2.3.4") {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Test User",
  email: "test@example.com",
  message: "Hello!",
  website: "",
  _t: Date.now() - 5000,
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockResolvedValue({ count: 0 }),
      }),
    });
  });

  it("returns success for honeypot submissions", async () => {
    const res = await POST(makeRequest({ ...validBody, website: "spam.com" }));
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns success for too-fast submissions", async () => {
    const res = await POST(makeRequest({ ...validBody, _t: Date.now() - 500 }));
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns 400 for missing name", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing email", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing message", async () => {
    const res = await POST(makeRequest({ ...validBody, message: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/email/i);
  });

  it("returns 400 for name exceeding 200 chars", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "a".repeat(201) }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/too long/i);
  });

  it("returns 400 for message exceeding 5000 chars", async () => {
    const res = await POST(
      makeRequest({ ...validBody, message: "a".repeat(5001) })
    );
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockResolvedValue({ count: 3 }),
      }),
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toMatch(/too many/i);
  });

  it("returns 200 and inserts on valid submission", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      message: "Hello!",
      ip: "1.2.3.4",
    });
  });
});
