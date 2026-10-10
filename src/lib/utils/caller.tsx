"use client";

import { useCallback } from "react";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
  type ResponseType,
} from "axios";
import { toast } from "../../components/custom/toast";
import {
  useMutation as useMutationDefault,
  useQuery as useQueryDefault,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from "../../cores/tanstack/query";

export type HttpMethod =
  "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type CallerRequestPriority = "high" | "low" | "auto";

export type CallerResponseHandler<TData> =
  | "json"
  | "text"
  | "blob"
  | "arrayBuffer"
  | "stream"
  | "content-type"
  | ((response: AxiosResponse<unknown>) => TData | Promise<TData>);

export interface CallerNextOptions {
  revalidate?: number | false;
  tags?: string[];
}

export interface CallerToastOptions<TData> {
  success?: string | ((data: TData) => string);
  error?: string | ((error: CallerError) => string);
}

export interface CallerErrorOptions {
  status?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
}

export class CallerError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, options: CallerErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "CallerError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

export interface CallerRequestOptions<
  TBody = unknown,
  TParams = Record<string, unknown>,
  TData = unknown,
> extends Omit<
  AxiosRequestConfig<TBody>,
  "url" | "method" | "data" | "params" | "auth" | "baseURL" | "responseType"
> {
  url: string;
  method?: HttpMethod | Lowercase<HttpMethod> | Method;
  params?: TParams;
  query?: TParams;
  body?: TBody;
  baseURL?: string | null;
  auth?: boolean;
  unwrapData?: boolean;
  schema?: CallerSchema<TData>;
  toast?: boolean | CallerToastOptions<TData>;
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: CallerError) => void | Promise<void>;
  responseType?: ResponseType;
  responseHandler?: CallerResponseHandler<TData>;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  integrity?: string;
  keepalive?: boolean;
  mode?: RequestMode;
  next?: CallerNextOptions;
  priority?: CallerRequestPriority;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  window?: null;
}

export type CallerQueryHookOptions<
  TData,
  TError = CallerError,
  TSelected = TData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TData, TError, TSelected, TQueryKey>,
  "queryKey" | "queryFn"
>;

export type CallerMutationHookOptions<
  TData,
  TVariables = void,
  TError = CallerError,
  TContext = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn">;

export interface CallerQueryOptions<
  TData,
  TError = CallerError,
  TSelected = TData,
  TQueryKey extends QueryKey = QueryKey,
  TBody = unknown,
  TParams = Record<string, unknown>,
> extends CallerRequestOptions<TBody, TParams, TData> {
  queryKey: TQueryKey;
  queryOptions?: CallerQueryHookOptions<TData, TError, TSelected, TQueryKey>;
}

export interface CallerMutationOptions<
  TData,
  TVariables = void,
  TError = CallerError,
  TContext = unknown,
  TBody = unknown,
  TParams = Record<string, unknown>,
> extends CallerRequestOptions<TBody, TParams, TData> {
  mutationOptions?: CallerMutationHookOptions<
    TData,
    TVariables,
    TError,
    TContext
  >;
  mapVariables?: (
    variables: TVariables,
    request: CallerRequestOptions<TBody, TParams, TData>,
  ) => CallerRequestOptions<TBody, TParams, TData>;
}

export interface CallerQueryServiceDefinition<
  TData,
  TArg,
  TError = CallerError,
  TSelected = TData,
  TQueryKey extends QueryKey = QueryKey,
  TBody = unknown,
  TParams = Record<string, unknown>,
> {
  queryKey: TQueryKey | ((arg: TArg) => TQueryKey);
  query:
    | CallerRequestOptions<TBody, TParams, TData>
    | ((arg: TArg) => CallerRequestOptions<TBody, TParams, TData>);
  queryOptions?:
    | CallerQueryHookOptions<TData, TError, TSelected, TQueryKey>
    | ((
        arg: TArg,
      ) => CallerQueryHookOptions<TData, TError, TSelected, TQueryKey>);
}

export interface CallerMutationServiceDefinition<
  TData,
  TVariables,
  TError = CallerError,
  TContext = unknown,
  TBody = unknown,
  TParams = Record<string, unknown>,
> {
  query:
    | CallerRequestOptions<TBody, TParams, TData>
    | ((variables: TVariables) => CallerRequestOptions<TBody, TParams, TData>);
  mutationOptions?: CallerMutationHookOptions<
    TData,
    TVariables,
    TError,
    TContext
  >;
  invalidates?:
    | readonly QueryKey[]
    | ((data: TData, variables: TVariables) => readonly QueryKey[]);
}

export interface CallerMutationPromise<TData> {
  unwrap: () => Promise<TData>;
}

export type CallerMutationTrigger<TData, TVariables> = (
  variables: TVariables,
) => CallerMutationPromise<TData>;

export type CallerMutationResult<TData, TError, TVariables, TContext> =
  UseMutationResult<TData, TError, TVariables, TContext> & {
    isLoading: boolean;
    isUninitialized: boolean;
  };

export type CallerMutationTuple<TData, TError, TVariables, TContext> =
  readonly [
    CallerMutationTrigger<TData, TVariables>,
    CallerMutationResult<TData, TError, TVariables, TContext>,
  ];

export function useQuery<
  TData,
  TArg,
  TError = CallerError,
  TSelected = TData,
  TQueryKey extends QueryKey = QueryKey,
  TBody = unknown,
  TParams = Record<string, unknown>,
>(
  definition: CallerQueryServiceDefinition<
    TData,
    TArg,
    TError,
    TSelected,
    TQueryKey,
    TBody,
    TParams
  >,
) {
  return definition;
}

export function useMutation<
  TData,
  TVariables,
  TError = CallerError,
  TContext = unknown,
  TBody = unknown,
  TParams = Record<string, unknown>,
>(
  definition: CallerMutationServiceDefinition<
    TData,
    TVariables,
    TError,
    TContext,
    TBody,
    TParams
  >,
) {
  return definition;
}

function hasFetchOptions(options: Record<string, unknown>) {
  return Object.values(options).some((value) => value !== undefined);
}

function getResponseType<TData>(
  handler: CallerResponseHandler<TData> | undefined,
  responseType: ResponseType | undefined,
): ResponseType | undefined {
  if (responseType || typeof handler !== "string") return responseType;

  switch (handler) {
    case "arrayBuffer":
      return "arraybuffer";
    case "content-type":
      return undefined;
    default:
      return handler;
  }
}

function unwrapResponse(payload: unknown, unwrapData: boolean) {
  if (
    unwrapData &&
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload
  ) {
    return (payload as { data: unknown }).data;
  }

  return payload;
}

async function handleResponse<TData>(
  response: AxiosResponse<unknown>,
  handler: CallerResponseHandler<TData> | undefined,
  unwrapData: boolean,
) {
  if (typeof handler === "function") return handler(response);
  return unwrapResponse(response.data, unwrapData) as TData;
}

function getErrorMessage(details: unknown) {
  if (typeof details === "string" && details.trim()) return details;
  if (!details || typeof details !== "object") return undefined;

  const payload = details as Record<string, unknown>;
  const nestedError = payload.error;

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  if (
    typeof payload.error_description === "string" &&
    payload.error_description.trim()
  ) {
    return payload.error_description;
  }
  if (typeof nestedError === "string" && nestedError.trim()) {
    return nestedError;
  }
  if (nestedError && typeof nestedError === "object") {
    const nestedMessage = (nestedError as Record<string, unknown>).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) {
      return nestedMessage;
    }
  }

  return undefined;
}

function getErrorCode(details: unknown) {
  if (!details || typeof details !== "object") return undefined;

  const payload = details as Record<string, unknown>;
  if (typeof payload.code === "string") return payload.code;
  if (typeof payload.error === "string") return payload.error;

  return undefined;
}

export function normalizeCallerError(error: unknown): CallerError {
  if (error instanceof CallerError) return error;

  if (axios.isAxiosError(error)) {
    const details = error.response?.data;

    return new CallerError(
      getErrorMessage(details) ?? error.message ?? "Request failed",
      {
        status: error.response?.status,
        code: getErrorCode(details) ?? error.code,
        details,
        cause: error,
      },
    );
  }

  if (error instanceof Error) {
    return new CallerError(error.message || "Request failed", {
      details: error,
      cause: error,
    });
  }

  return new CallerError(getErrorMessage(error) ?? "Request failed", {
    details: error,
    cause: error,
  });
}

function resolveToastMessage<TValue>(
  value: string | ((input: TValue) => string) | undefined,
  input: TValue,
) {
  return typeof value === "function" ? value(input) : value;
}

function notifySuccess<TData>(
  option: boolean | CallerToastOptions<TData> | undefined,
  data: TData,
  notify: (notification: CallerNotification) => void,
) {
  if (!option || option === true) return;

  const message = resolveToastMessage(option.success, data);
  if (message)
    notify({
      type: "success",
      description: message,
    });
}

function notifyError<TData>(
  option: boolean | CallerToastOptions<TData> | undefined,
  error: CallerError,
  notify: (notification: CallerNotification) => void,
) {
  if (!option) return;

  const message =
    option === true
      ? error.message
      : (resolveToastMessage(option.error, error) ?? error.message);
  notify({
    type: "error",
    description: message,
  });
}

/** Only the parsing contract is required; Zod 3/4 schemas work without a package dependency. */
export interface CallerSchema<TData> {
  parseAsync(input: unknown): Promise<TData>;
}

export interface CallerNotification {
  type: "success" | "error";
  description: string;
}

export interface CallerConfiguration {
  /** Supply an existing Axios instance, or configure the instance created for this caller. */
  client?: AxiosInstance;
  defaults?: AxiosRequestConfig;
  /** App-owned refresh coordination. No retry or SSO configuration is implicit. */
  withAuthRetry?: <T>(
    request: () => Promise<T>,
    getStatus: (error: unknown) => number | undefined,
    enabled: boolean,
  ) => Promise<T>;
  isAuthRequest?: (request: { url: string; method: Method }) => boolean;
  /** Defaults to Primitive's custom toast manager. Pass a no-op to disable notifications. */
  notify?: (notification: CallerNotification) => void;
}

function isAuthenticationRequest({ url }: { url: string }) {
  return /^\/auth(?:\/|$)/.test(new URL(url, "http://caller.invalid").pathname);
}

/** Create isolated HTTP clients and hooks; configuration is never stored globally. */
export function createCaller(settings: CallerConfiguration = {}) {
  const callerClient =
    settings.client ??
    axios.create({
      withCredentials: true,
      headers: { Accept: "application/json" },
      ...settings.defaults,
    });
  const withAuthRetry =
    settings.withAuthRetry ?? (<T,>(request: () => Promise<T>) => request());
  const isAuthRequest = settings.isAuthRequest ?? isAuthenticationRequest;
  const notify =
    settings.notify ??
    ((notification: CallerNotification) => {
      toast.add(notification);
    });

  async function caller<
    TData = unknown,
    TBody = unknown,
    TParams = Record<string, unknown>,
  >(options: CallerRequestOptions<TBody, TParams, TData>): Promise<TData> {
    const {
      url,
      method = "GET",
      params,
      query,
      body,
      baseURL,
      auth = true,
      unwrapData = true,
      schema,
      toast,
      onSuccess,
      onError,
      responseType,
      responseHandler,
      cache,
      credentials,
      integrity,
      keepalive,
      mode,
      next,
      priority,
      redirect,
      referrer,
      referrerPolicy,
      window,
      ...config
    } = options;

    const fetchOptions = {
      ...config.fetchOptions,
      cache,
      credentials,
      integrity,
      keepalive,
      mode,
      next,
      priority,
      redirect,
      referrer,
      referrerPolicy,
      window,
    } as Record<string, unknown>;
    const methodName = method.toUpperCase();
    const hasUnsupportedFetchBody =
      (methodName === "GET" || methodName === "HEAD") && body !== undefined;
    const useFetchAdapter =
      hasFetchOptions(fetchOptions) && !hasUnsupportedFetchBody;

    const request = () =>
      callerClient.request<unknown, AxiosResponse<unknown>, TBody>({
        ...config,
        adapter:
          config.adapter ??
          (settings.client
            ? settings.client.defaults.adapter
            : settings.defaults?.adapter) ??
          (useFetchAdapter ? "fetch" : undefined),
        baseURL: baseURL === null ? "" : baseURL,
        url,
        method,
        params: query ?? params,
        data: body,
        responseType: getResponseType(responseHandler, responseType),
        withCredentials:
          credentials === undefined
            ? (config.withCredentials ??
              callerClient.defaults.withCredentials ??
              true)
            : credentials === "include",
        fetchOptions,
      });

    try {
      const response = await withAuthRetry(
        request,
        (error) =>
          axios.isAxiosError(error) ? error.response?.status : undefined,
        auth && !isAuthRequest({ url, method }),
      );
      if (response.status === 204) {
        const data = null as TData;

        await onSuccess?.(data);
        notifySuccess(toast, data, notify);

        return data;
      }

      const responseData = await handleResponse(
        response,
        responseHandler,
        unwrapData,
      );
      const data = schema
        ? await schema.parseAsync(responseData)
        : responseData;

      await onSuccess?.(data);
      notifySuccess(toast, data, notify);

      return data;
    } catch (error) {
      const normalizedError = normalizeCallerError(error);

      await onError?.(normalizedError);
      notifyError(toast, normalizedError, notify);

      throw normalizedError;
    }
  }

  function useCallerQuery<
    TData = unknown,
    TError = CallerError,
    TSelected = TData,
    TQueryKey extends QueryKey = QueryKey,
    TBody = unknown,
    TParams = Record<string, unknown>,
  >(
    options: CallerQueryOptions<
      TData,
      TError,
      TSelected,
      TQueryKey,
      TBody,
      TParams
    >,
  ): UseQueryResult<TSelected, TError> {
    const { queryKey, queryOptions, ...requestOptions } = options;

    return useQueryDefault<TData, TError, TSelected, TQueryKey>({
      ...queryOptions,
      queryKey,
      queryFn: ({ signal }) =>
        caller<TData, TBody, TParams>({
          ...requestOptions,
          signal: requestOptions.signal ?? signal,
        }),
    });
  }

  function useCallerMutation<
    TData = unknown,
    TVariables = void,
    TError = CallerError,
    TContext = unknown,
    TBody = unknown,
    TParams = Record<string, unknown>,
  >(
    options: CallerMutationOptions<
      TData,
      TVariables,
      TError,
      TContext,
      TBody,
      TParams
    >,
  ): UseMutationResult<TData, TError, TVariables, TContext> {
    const { mutationOptions, mapVariables, ...requestOptions } = options;

    return useMutationDefault<TData, TError, TVariables, TContext>({
      ...mutationOptions,
      mutationFn: (variables) =>
        caller<TData, TBody, TParams>(
          mapVariables
            ? mapVariables(variables, requestOptions)
            : requestOptions,
        ),
    });
  }

  function createQueryService<
    TData,
    TArg,
    TError = CallerError,
    TSelected = TData,
    TQueryKey extends QueryKey = QueryKey,
    TBody = unknown,
    TParams = Record<string, unknown>,
  >(
    definition: CallerQueryServiceDefinition<
      TData,
      TArg,
      TError,
      TSelected,
      TQueryKey,
      TBody,
      TParams
    >,
  ) {
    return function useDefinedQuery(arg: TArg) {
      const request =
        typeof definition.query === "function"
          ? definition.query(arg)
          : definition.query;
      const queryKey =
        typeof definition.queryKey === "function"
          ? definition.queryKey(arg)
          : definition.queryKey;
      const queryOptions =
        typeof definition.queryOptions === "function"
          ? definition.queryOptions(arg)
          : definition.queryOptions;

      return useCallerQuery<
        TData,
        TError,
        TSelected,
        TQueryKey,
        TBody,
        TParams
      >({
        ...request,
        queryKey,
        queryOptions,
      });
    };
  }

  function createMutationService<
    TData,
    TVariables,
    TError = CallerError,
    TContext = unknown,
    TBody = unknown,
    TParams = Record<string, unknown>,
  >(
    definition: CallerMutationServiceDefinition<
      TData,
      TVariables,
      TError,
      TContext,
      TBody,
      TParams
    >,
  ) {
    return function useDefinedMutation(): CallerMutationTuple<
      TData,
      TError,
      TVariables,
      TContext
    > {
      const queryClient = useQueryClient();
      const mutation = useMutationDefault<TData, TError, TVariables, TContext>({
        ...definition.mutationOptions,
        mutationFn: (variables) => {
          const request =
            typeof definition.query === "function"
              ? definition.query(variables)
              : definition.query;

          return caller<TData, TBody, TParams>(request);
        },
        onSuccess: async (data, variables, result, context) => {
          await definition.mutationOptions?.onSuccess?.(
            data,
            variables,
            result,
            context,
          );

          const queryKeys =
            typeof definition.invalidates === "function"
              ? definition.invalidates(data, variables)
              : definition.invalidates;

          if (!queryKeys) return;

          await Promise.all(
            queryKeys.map((queryKey) =>
              queryClient.invalidateQueries({ queryKey }),
            ),
          );
        },
      });
      const { mutateAsync } = mutation;

      const trigger = useCallback(
        (variables: TVariables): CallerMutationPromise<TData> => {
          const promise = mutateAsync(variables);

          // Attach a rejection handler immediately. `unwrap()` still exposes the
          // original rejected promise, while ignored triggers remain safe.
          void promise.catch(() => undefined);

          return {
            unwrap: () => promise,
          };
        },
        [mutateAsync],
      );

      const result: CallerMutationResult<TData, TError, TVariables, TContext> =
        {
          ...mutation,
          isLoading: mutation.isPending,
          isUninitialized: mutation.status === "idle",
        };

      return [trigger, result];
    };
  }

  type RequestOptionsWithoutRoute<TBody, TParams, TData> = Omit<
    CallerRequestOptions<TBody, TParams, TData>,
    "url" | "method" | "body"
  >;

  const http = {
    request: caller,
    get<TData = unknown, TParams = Record<string, unknown>>(
      url: string,
      options: RequestOptionsWithoutRoute<never, TParams, TData> = {},
    ) {
      return caller<TData, never, TParams>({ ...options, url, method: "GET" });
    },
    post<TData = unknown, TBody = unknown, TParams = Record<string, unknown>>(
      url: string,
      body?: TBody,
      options: RequestOptionsWithoutRoute<TBody, TParams, TData> = {},
    ) {
      return caller<TData, TBody, TParams>({
        ...options,
        url,
        method: "POST",
        body,
      });
    },
    put<TData = unknown, TBody = unknown, TParams = Record<string, unknown>>(
      url: string,
      body?: TBody,
      options: RequestOptionsWithoutRoute<TBody, TParams, TData> = {},
    ) {
      return caller<TData, TBody, TParams>({
        ...options,
        url,
        method: "PUT",
        body,
      });
    },
    patch<TData = unknown, TBody = unknown, TParams = Record<string, unknown>>(
      url: string,
      body?: TBody,
      options: RequestOptionsWithoutRoute<TBody, TParams, TData> = {},
    ) {
      return caller<TData, TBody, TParams>({
        ...options,
        url,
        method: "PATCH",
        body,
      });
    },
    delete<TData = unknown, TBody = unknown, TParams = Record<string, unknown>>(
      url: string,
      options: Omit<
        CallerRequestOptions<TBody, TParams, TData>,
        "url" | "method"
      > = {},
    ) {
      return caller<TData, TBody, TParams>({
        ...options,
        url,
        method: "DELETE",
      });
    },
    head<TData = unknown, TParams = Record<string, unknown>>(
      url: string,
      options: RequestOptionsWithoutRoute<never, TParams, TData> = {},
    ) {
      return caller<TData, never, TParams>({ ...options, url, method: "HEAD" });
    },
    options<
      TData = unknown,
      TBody = unknown,
      TParams = Record<string, unknown>,
    >(
      url: string,
      options: Omit<
        CallerRequestOptions<TBody, TParams, TData>,
        "url" | "method"
      > = {},
    ) {
      return caller<TData, TBody, TParams>({
        ...options,
        url,
        method: "OPTIONS",
      });
    },
  };

  return {
    callerClient,
    caller,
    http,
    useCallerQuery,
    useCallerMutation,
    createQueryService,
    createMutationService,
    useQuery,
    useMutation,
  };
}

/** Same-origin defaults, with no app-specific authentication. */
export const {
  callerClient,
  caller,
  http,
  useCallerQuery,
  useCallerMutation,
  createQueryService,
  createMutationService,
} = createCaller();
