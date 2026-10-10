import axios, { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CallerError,
  caller,
  callerClient,
  createCaller,
  normalizeCallerError,
  useMutation,
  useQuery,
} from "../src/lib/utils/caller";

const hooks = vi.hoisted(() => ({
  query: vi.fn(),
  mutation: vi.fn(),
  invalidateQueries: vi.fn(),
  addToast: vi.fn(),
}));

vi.mock("../src/components/custom/toast", () => ({
  toast: { add: hooks.addToast },
}));
vi.mock("../src/cores/tanstack/query", () => ({
  useQuery: hooks.query,
  useMutation: hooks.mutation,
  useQueryClient: () => ({ invalidateQueries: hooks.invalidateQueries }),
}));
vi.mock("react", () => ({ useCallback: (callback: unknown) => callback }));

function response(data: unknown = { data: { id: "example" } }, status = 200) {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config: { headers: new AxiosHeaders() },
  } satisfies AxiosResponse;
}

function setup() {
  const api = createCaller();
  const request = vi
    .spyOn(api.callerClient, "request")
    .mockResolvedValue(response());
  return { api, request };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("caller requests", () => {
  it("defaults to same-origin, credentialed GET and unwraps data", async () => {
    const { api, request } = setup();
    await expect(api.caller({ url: "/user" })).resolves.toEqual({
      id: "example",
    });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/user",
        method: "GET",
        baseURL: undefined,
        withCredentials: true,
      }),
    );
    expect(api.callerClient.defaults.baseURL).toBeUndefined();
    expect(hooks.addToast).not.toHaveBeenCalled();
  });

  it("preserves the default top-level caller API", async () => {
    vi.spyOn(callerClient, "request").mockResolvedValue(response());
    await expect(caller({ url: "/user" })).resolves.toEqual({ id: "example" });
  });

  it("isolates client defaults, auth and notification callbacks", async () => {
    const first = createCaller({
      defaults: { baseURL: "https://first.invalid", withCredentials: false },
    });
    const second = createCaller({
      defaults: { baseURL: "https://second.invalid" },
    });
    expect(first.callerClient).not.toBe(second.callerClient);
    expect(first.callerClient.defaults.baseURL).toBe("https://first.invalid");
    expect(second.callerClient.defaults.baseURL).toBe("https://second.invalid");
    const request = vi
      .spyOn(first.callerClient, "request")
      .mockResolvedValue(response());
    await first.caller({ url: "/user", baseURL: null });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: "", withCredentials: false }),
    );
  });

  it("reuses a supplied Axios client without mutating its defaults", async () => {
    const client = axios.create({
      baseURL: "https://upstream.invalid",
      adapter: "xhr",
    });
    const api = createCaller({ client });
    expect(api.callerClient).toBe(client);
    expect(client.defaults.baseURL).toBe("https://upstream.invalid");
    const request = vi.spyOn(client, "request").mockResolvedValue(response());
    await api.caller({ url: "/user", cache: "no-store" });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ adapter: "xhr" }),
    );
  });

  it("passes body, query, credentials and cancellation without rewriting them", async () => {
    const { api, request } = setup();
    const signal = new AbortController().signal;
    await api.caller({
      url: "/user",
      method: "POST",
      body: { name: "test" },
      params: { ignored: true },
      query: { page: 2 },
      credentials: "omit",
      signal,
    });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "test" },
        params: { page: 2 },
        withCredentials: false,
        signal,
      }),
    );
  });

  it("validates the unwrapped response through an injected Zod-compatible schema", async () => {
    const { api } = setup();
    const parseAsync = vi.fn(async (input: unknown) => ({
      ...(input as object),
      valid: true,
    }));
    await expect(
      api.caller({ url: "/user", schema: { parseAsync } }),
    ).resolves.toEqual({ id: "example", valid: true });
    expect(parseAsync).toHaveBeenCalledWith({ id: "example" });
  });

  it("allows raw payloads and custom response handlers", async () => {
    const { api } = setup();
    await expect(
      api.caller({ url: "/user", unwrapData: false }),
    ).resolves.toEqual({ data: { id: "example" } });
    await expect(
      api.caller({ url: "/user", responseHandler: (result) => result.status }),
    ).resolves.toBe(200);
  });

  it("returns null for a 204 response without trying to parse it", async () => {
    const { api, request } = setup();
    request.mockResolvedValue(response("", 204));
    const parseAsync = vi.fn();
    const onSuccess = vi.fn();
    await expect(
      api.caller({ url: "/user", schema: { parseAsync }, onSuccess }),
    ).resolves.toBeNull();
    expect(parseAsync).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(null);
  });

  it("uses the fetch adapter only when required, keeping explicit XHR working for Electron", async () => {
    const { api, request } = setup();
    await api.caller({ url: "/user", cache: "no-store" });
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ adapter: "fetch" }),
    );
    await api.caller({ url: "/user", cache: "no-store", adapter: "xhr" });
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ adapter: "xhr" }),
    );
    await api.caller({
      url: "/user",
      body: { supportedByAxios: true },
      cache: "no-store",
    });
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ adapter: undefined }),
    );
    const desktop = createCaller({ defaults: { adapter: "xhr" } });
    const desktopRequest = vi
      .spyOn(desktop.callerClient, "request")
      .mockResolvedValue(response());
    await desktop.caller({ url: "/user", cache: "no-store" });
    expect(desktopRequest).toHaveBeenCalledWith(
      expect.objectContaining({ adapter: "xhr" }),
    );
  });

  it("retains HTTP method helpers", async () => {
    const { api, request } = setup();
    await api.http.get("/user");
    await api.http.post("/user", { id: 1 });
    await api.http.put("/user", { id: 2 });
    await api.http.patch("/user", { id: 3 });
    await api.http.delete("/user", { body: { id: 4 } });
    await api.http.head("/user");
    await api.http.options("/user");
    expect(request.mock.calls.map(([config]) => config?.method)).toEqual([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ]);
  });
});

describe("app-owned auth and notifications", () => {
  it("never retries an unauthorized request implicitly", async () => {
    const { api, request } = setup();
    request.mockRejectedValue(
      new AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        response({}, 401),
      ),
    );
    await expect(api.caller({ url: "/user" })).rejects.toMatchObject({
      status: 401,
    });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("delegates refresh coordination and supplies Axios status to the app", async () => {
    const enabled: boolean[] = [];
    const api = createCaller({
      withAuthRetry: async (request, getStatus, canRetry) => {
        enabled.push(canRetry);
        try {
          return await request();
        } catch (error) {
          if (canRetry && getStatus(error) === 401) return request();
          throw error;
        }
      },
    });
    const request = vi
      .spyOn(api.callerClient, "request")
      .mockRejectedValueOnce(
        new AxiosError(
          "Unauthorized",
          undefined,
          undefined,
          undefined,
          response({}, 401),
        ),
      )
      .mockResolvedValue(response());
    await api.caller({ url: "/user" });
    await api.caller({ url: "/auth/refresh" });
    await api.caller({ url: "/auth" });
    await api.caller({ url: "/public", auth: false });
    await api.caller({ url: "/user?returnTo=/auth/sign-in" });
    expect(enabled).toEqual([true, false, false, false, true]);
    expect(request).toHaveBeenCalledTimes(6);
  });

  it("allows an application-specific auth path policy", async () => {
    const withAuthRetry = vi.fn();
    const api = createCaller({
      withAuthRetry: (request, getStatus, enabled) => {
        withAuthRetry(request, getStatus, enabled);
        return request();
      },
      isAuthRequest: ({ url }) => url.startsWith("/identity"),
    });
    vi.spyOn(api.callerClient, "request").mockResolvedValue(response());
    await api.caller({ url: "/identity/login" });
    expect(withAuthRetry).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      false,
    );
  });

  it("uses custom toast by default and allows an isolated notification adapter", async () => {
    const { api } = setup();
    await api.caller({
      url: "/user",
      toast: {
        success: (data: unknown) => `Loaded ${(data as { id: string }).id}`,
      },
    });
    expect(hooks.addToast).toHaveBeenCalledWith({
      type: "success",
      description: "Loaded example",
    });
    const notify = vi.fn();
    const isolated = createCaller({ notify });
    vi.spyOn(isolated.callerClient, "request").mockRejectedValue(
      new Error("offline"),
    );
    await expect(
      isolated.caller({ url: "/user", toast: true }),
    ).rejects.toBeInstanceOf(CallerError);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      description: "offline",
    });
    expect(hooks.addToast).toHaveBeenCalledTimes(1);
  });

  it("normalizes structured Axios errors and preserves callback behavior", async () => {
    const { api, request } = setup();
    request.mockRejectedValue(
      new AxiosError(
        "Request failed",
        undefined,
        undefined,
        undefined,
        response({ error: { message: "Denied" }, code: "denied" }, 403),
      ),
    );
    const onError = vi.fn();
    await expect(
      api.caller({ url: "/user", onError, toast: { error: "Try again" } }),
    ).rejects.toMatchObject({ message: "Denied", status: 403, code: "denied" });
    expect(onError).toHaveBeenCalledWith(expect.any(CallerError));
    expect(hooks.addToast).toHaveBeenCalledWith({
      type: "error",
      description: "Try again",
    });
    const error = new CallerError("existing");
    expect(normalizeCallerError(error)).toBe(error);
    expect(
      normalizeCallerError({ error_description: "OAuth error" }).message,
    ).toBe("OAuth error");
  });
});

describe("TanStack Query services", () => {
  it("passes query keys, dynamic options and cancellation to a bound caller", async () => {
    const { api, request } = setup();
    const definition = useQuery({
      queryKey: (id: string) => ["user", id],
      query: (id: string) => ({ url: `/user/${id}` }),
      queryOptions: (id: string) => ({ enabled: Boolean(id) }),
    });
    api.createQueryService(definition)("example");
    const options = hooks.query.mock.calls[0][0];
    expect(options.queryKey).toEqual(["user", "example"]);
    expect(options.enabled).toBe(true);
    const signal = new AbortController().signal;
    await options.queryFn({ signal });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/user/example", signal }),
    );
  });

  it("maps useCallerMutation variables into a request", async () => {
    const { api, request } = setup();
    api.useCallerMutation({
      url: "/user",
      method: "POST",
      mapVariables: (id: string, options) => ({ ...options, body: { id } }),
    });
    await hooks.mutation.mock.calls[0][0].mutationFn("example");
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ data: { id: "example" } }),
    );
  });

  it("supports mutation unwrap, local callbacks and targeted invalidation", async () => {
    const { api, request } = setup();
    const mutateAsync = vi.fn().mockResolvedValue({ id: "example" });
    hooks.mutation.mockReturnValue({
      mutateAsync,
      isPending: false,
      status: "idle",
    });
    const onSuccess = vi.fn();
    const definition = useMutation({
      query: (id: string) => ({
        url: "/user",
        method: "POST" as const,
        body: { id },
      }),
      mutationOptions: { onSuccess },
      invalidates: [["user"]],
    });
    const [trigger, result] = api.createMutationService(definition)();
    await expect(trigger("example").unwrap()).resolves.toEqual({
      id: "example",
    });
    expect(result.isLoading).toBe(false);
    expect(result.isUninitialized).toBe(true);
    const options = hooks.mutation.mock.calls[0][0];
    await options.mutationFn("example");
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ data: { id: "example" } }),
    );
    await options.onSuccess({ id: "example" }, "example", undefined, {});
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(hooks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["user"],
    });
  });
});
