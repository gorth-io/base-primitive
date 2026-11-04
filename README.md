# @gorth-io/primitive

React UI components, Tailwind CSS themes, layouts, hooks, and TanStack integrations for the **gorth-io** ecosystem.

| Includes | Public imports |
| --- | --- |
| Custom components | `@gorth-io/primitive/custom/*` |
| Default components and patterns | `@gorth-io/primitive/default/*`, `pattern/*` |
| Layouts, providers, and hooks | `@gorth-io/primitive/layouts/*`, `providers/*`, `hooks/*` |
| TanStack, icons, and utilities | `@gorth-io/primitive/cores/*`, `utils/*` |
| Shared styles and assets | `@gorth-io/primitive/globals.css`, `assets/*` |

## Installation

Use Node.js 24 and install from the npm registry with Bun:

```bash
bun add @gorth-io/primitive
```

React and React DOM are peer dependencies. Next.js integrations additionally use
the optional Next.js and next-themes peers.

Example dependency declaration (`0.0.0` is a demo version; replace it with an available release):

```json
{
  "dependencies": {
    "@gorth-io/primitive": "0.0.0"
  }
}
```

## Usage

Import Tailwind once, then import the shared stylesheet. Primitive
registers its own component sources and build output, so consumers do not need a `node_modules`
`@source` path:

```css
@import "tailwindcss";
@import "@gorth-io/primitive/globals.css";

@source "../**/*.{ts,tsx}";
```

```tsx
import { Button } from "@gorth-io/primitive/custom/button";

export function Demo() {
  return <Button>Click me</Button>;
}
```

## Development

```bash
bun install --frozen-lockfile
bun run build
bun run dev
```

## Caller and fetcher

HTTP helpers support application-owned clients, authentication retry policies,
and notifications without reading application environment variables.

### Browser and Electron renderer

```tsx
"use client";

import { createCaller } from "@gorth-io/primitive/utils/caller";

export const { caller, http, createQueryService, createMutationService } =
  createCaller({
    // Optional: inject the app's existing refresh coordinator. The package
    // does not read environment variables, configure SSO or store tokens.
    // withAuthRetry,
    // Electron: defaults: { adapter: "xhr" },
  });

export const useUser = createQueryService<{ name: string }, void>({
  queryKey: ["user"],
  query: { url: "/user" },
});
```

Wrap query hooks in `QueryClientProvider` from
`@gorth-io/primitive/cores/tanstack/query`. Mount `Toaster` from
`@gorth-io/primitive/custom/toast` for default notifications, or pass `notify`
to integrate an app's own toaster. A no-op `notify` disables notifications.

- `caller`, `http`, `useCallerQuery`, `useCallerMutation`,
  `createQueryService`, `createMutationService`, `useQuery` and `useMutation`
  retain the app utility API. `useQuery`/`useMutation` are definition helpers,
  not the TanStack hooks.
- Optional `schema` accepts Zod 3/4's `parseAsync` contract. Import Zod from
  the app's existing dependency; Primitive does not depend on Structure.
- Defaults are same-origin requests with credentials. Each `createCaller`
  has its own Axios client, configuration and auth/notification adapters.
- `client` reuses an app-owned Axios instance; `defaults` configures a newly
  created instance. Request options override those defaults. `baseURL: null`
  clears a configured base URL for a same-origin request.
- `withAuthRetry(request, getStatus, enabled)` is app-owned. By default there
  is **no automatic refresh/retry**. With an adapter, `auth: false` and
  `/auth` requests pass `enabled: false`; `isAuthRequest` customizes that policy.
  The app must honor this flag and restrict retries to its intended origins.
- For Electron, explicitly use `defaults: { adapter: "xhr" }` to keep the
  Chromium networking path, even when cache/fetch-style options are supplied.
- `caller` and `http` can also be imported directly for unconfigured,
  same-origin usage. Avoid putting per-user secrets into shared defaults.

### Server / Next.js Route Handler

```ts
import { fetcher, toWebResponse } from "@gorth-io/primitive/utils/fetcher";

export async function GET() {
  const response = await fetcher({
    url: "https://upstream.example/user",
    method: "GET",
    redirect: "manual",
    validateStatus: () => true,
  });
  return toWebResponse(response);
}
```

Fetcher uses Axios and has no React, toast, Next.js or authentication imports.
Apps supply upstream URLs, credentials and authorization headers. Axios
rejects non-2xx responses by default; use `validateStatus` when forwarding
upstream errors or redirects. `toWebResponse` preserves status, headers and
binary data, with empty bodies for 204/205/304. This utility is for buffered
payloads, not Node streams. `redirect: "manual"`/`"error"` disable Node Axios
redirect following; browser transports follow their browser redirect rules.
Axios cache headers are not Next.js Data Cache or revalidation support.

### Verification

```bash
bun run build
bun run typecheck
bun run test
```

Build first: the public-export tests consume `dist`, like an installed app.
Publish the package and update consumers before using new exports outside this repository.

## Related packages

- [@gorth-io/structure](https://www.npmjs.com/package/@gorth-io/structure): HTTP, authentication coordination, and data infrastructure.
- [@gorth-io/principle](https://www.npmjs.com/package/@gorth-io/principle): backend middleware and server integrations.
