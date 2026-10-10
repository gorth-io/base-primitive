import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  QueryClient,
  QueryClientProvider,
} from "@gorth/primitive/cores/tanstack/query";
import { createCaller } from "@gorth/primitive/lib/utils/caller";
import { fetcher, toWebResponse } from "@gorth/primitive/lib/utils/fetcher";

describe("built public exports", () => {
  it("publishes a client-only caller and UI-free server fetcher", () => {
    const callerSource = readFileSync(
      new URL("../dist/lib/utils/caller.js", import.meta.url),
      "utf8",
    );
    const fetcherSource = readFileSync(
      new URL("../dist/lib/utils/fetcher.js", import.meta.url),
      "utf8",
    );
    expect(callerSource).toMatch(/^['"]use client['"]/);
    expect(fetcherSource).not.toMatch(
      /use client|react|toast|next|@\/|@gorth\/structure/,
    );
    expect(callerSource).not.toMatch(
      /process\.env|import\.meta\.env|@gorth\/structure|@\//,
    );
  });

  it("consumes the public caller and query hooks with a real shared QueryClientProvider", async () => {
    const api = createCaller({
      notify: () => {},
      defaults: {
        adapter: async (config) => ({
          data: { data: { name: "Consumer" } },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        }),
      },
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await client.fetchQuery({
      queryKey: ["user"],
      queryFn: () => api.http.get<{ name: string }>("/user"),
    });
    const useUser = api.createQueryService<{ name: string }, void>({
      queryKey: ["user"],
      query: { url: "/user" },
      queryOptions: { staleTime: Infinity },
    });
    function Consumer() {
      const { data } = useUser();
      api.useCallerMutation({ url: "/user", method: "POST" });
      return createElement("span", null, data?.name);
    }
    expect(
      renderToString(
        createElement(QueryClientProvider, { client }, createElement(Consumer)),
      ),
    ).toBe("<span>Consumer</span>");
    client.clear();
  });

  it("consumes the public server fetcher with an Axios transport and a web Response", async () => {
    const result = await fetcher<{ ok: boolean }>({
      url: "https://upstream.invalid/user",
      method: "GET",
      adapter: async (config) => ({
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        config,
      }),
    });
    expect(await toWebResponse(result).json()).toEqual({ ok: true });
  });
});
