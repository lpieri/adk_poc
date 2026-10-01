import { describe, expect, it, vi } from "vitest";
import { jsonResponse } from "../../test/fixtures";
import { ApiError, isNotFound, request, withUser } from "../client";

describe("api client", () => {
  it("gets JSON from the proxied API", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(request("/health")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith("/api/health", { method: "GET", headers: undefined, body: undefined });
  });

  it("sends JSON bodies and handles empty responses", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(null, 204));
    vi.stubGlobal("fetch", fetchMock);
    await expect(request("/things", "POST", { a: 1 })).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/things", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{\"a\":1}",
    });
  });

  it("throws an ApiError on HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, 404)));
    const error = await request("/missing").catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(ApiError);
    expect(isNotFound(error)).toBe(true);
    expect(isNotFound(new ApiError(500))).toBe(false);
    expect(isNotFound(new Error("x"))).toBe(false);
  });

  it("encodes the user id in query strings", () => {
    expect(withUser("/horses", "a b")).toBe("/horses?user_id=a%20b");
  });
});
