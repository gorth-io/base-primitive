import axios, { AxiosHeaders, type AxiosResponse } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetcher, toWebResponse } from "../src/lib/utils/fetcher";

function response(
  data: unknown,
  status = 200,
  headers: AxiosResponse["headers"] = {},
) {
  return {
    data,
    status,
    statusText: "OK",
    headers,
    config: { headers: new AxiosHeaders() },
  } satisfies AxiosResponse;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Axios fetcher", () => {
  it("keeps method, body, parameters and URL objects", async () => {
    const result = response({ ok: true });
    const request = vi.spyOn(axios, "request").mockResolvedValue(result);
    await expect(
      fetcher({
        url: new URL("https://upstream.invalid/user"),
        method: "POST",
        body: { name: "test" },
        params: { page: 1 },
      }),
    ).resolves.toBe(result);
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://upstream.invalid/user",
        method: "POST",
        data: { name: "test" },
        params: { page: 1 },
        withCredentials: false,
      }),
    );
  });

  it("forwards headers, manual redirects, cancellation and credentials", async () => {
    const request = vi
      .spyOn(axios, "request")
      .mockResolvedValue(response(null));
    const signal = new AbortController().signal;
    await fetcher({
      url: "/user",
      method: "GET",
      cache: "no-store",
      credentials: "include",
      redirect: "manual",
      maxRedirects: 5,
      headers: { Authorization: "Bearer example" },
      signal,
    });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          "Cache-Control": "no-store",
          Authorization: "Bearer example",
        },
        withCredentials: true,
        maxRedirects: 0,
        signal,
      }),
    );
  });

  it.each(["no-cache", "reload"] as const)(
    "maps %s to cache headers",
    async (cache) => {
      const request = vi
        .spyOn(axios, "request")
        .mockResolvedValue(response(null));
      await fetcher({ url: "/user", method: "GET", cache });
      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({ headers: { "Cache-Control": "no-cache" } }),
      );
    },
  );

  it("allows explicit cache header overrides and configured redirects", async () => {
    const request = vi
      .spyOn(axios, "request")
      .mockResolvedValue(response(null));
    await fetcher({
      url: "/user",
      method: "GET",
      cache: "no-store",
      headers: { "Cache-Control": "private" },
      redirect: "follow",
      maxRedirects: 2,
    });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { "Cache-Control": "private" },
        maxRedirects: 2,
      }),
    );
  });

  it("propagates upstream errors without toast, refresh or UI dependencies", async () => {
    const error = new Error("upstream unavailable");
    vi.spyOn(axios, "request").mockRejectedValue(error);
    await expect(fetcher({ url: "/user", method: "GET" })).rejects.toBe(error);
  });
});

describe("toWebResponse", () => {
  it("serializes JSON and preserves status and headers including Set-Cookie", async () => {
    const result = toWebResponse(
      response({ ok: true }, 201, {
        "content-type": "application/json",
        "set-cookie": ["first=a; HttpOnly", "second=b; HttpOnly"],
      }),
    );
    expect(result.status).toBe(201);
    expect(await result.json()).toEqual({ ok: true });
    expect(result.headers.getSetCookie()).toEqual([
      "first=a; HttpOnly",
      "second=b; HttpOnly",
    ]);
  });

  it.each([204, 205, 304])(
    "never constructs an invalid body for status %s",
    (status) => {
      const result = toWebResponse(response("should be ignored", status));
      expect(result.status).toBe(status);
      expect(result.body).toBeNull();
    },
  );

  it("preserves text and Blob payloads", async () => {
    expect(await toWebResponse(response("text")).text()).toBe("text");
    expect(await toWebResponse(response(new Blob(["blob"]))).text()).toBe(
      "blob",
    );
  });

  it("preserves byte offsets for typed-array and Buffer payloads", async () => {
    const bytes = new Uint8Array([99, 1, 2, 99]);
    const result = await toWebResponse(
      response(bytes.subarray(1, 3)),
    ).arrayBuffer();
    expect([...new Uint8Array(result)]).toEqual([1, 2]);
    expect([
      ...new Uint8Array(
        await toWebResponse(response(Buffer.from([3, 4]))).arrayBuffer(),
      ),
    ]).toEqual([3, 4]);
  });

  it("accepts null payloads", () => {
    expect(toWebResponse(response(null)).body).toBeNull();
  });
});
