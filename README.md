# Fullstack monorepo template feat. Expo, Turbo, Next.js, Convex

This is a modern TypeScript monorepo template with web and native apps featuring:

- Turborepo: Monorepo management
- Next.js 14: Web app
- React Native [Expo](https://expo.dev/): Mobile/native app
- [Convex](https://convex.dev): Backend, database, server functions, and authentication
- TailwindCSS: Styling for web app
- NativeWind: Styling for mobile app

This project is a simple platform for booking common areas in a condominium. \
It was inspired by the lack of such a system in the condominium where I currently live. \
I decided to include React Native to test how far I could go in creating a native app with Convex for a hackathon project.

Features include:

- Dashboard page (web & native)
- Booking page (web & native)
- Backend API that serves web & native with the same API
- Relational database
- End to end type safety (schema definition to frontend API clients)
- User authentication using Convex's native authentication

## Using this example

### 1. Install dependencies

If you don't have `pnpm` installed, run `npm install --global pnpm`.

Run `pnpm install`.

### 2. Configure Convex

> Note: The following command will print an error and ask you to add the
> appropriate environment variable to proceed. Continue reading on for how to do
> that.

```sh
npm run setup --workspace packages/backend
```

The script will log you into Convex if you aren't already and prompt you to
create a project (free). It will then wait to deploy your code until you set the
environment variables in the dashboard.

The `setup` command should now finish successfully.

### 3. Configure both apps

Please follow the `.env.local.example` files to configure the apps easily.

In each app directory (`apps/web`, `apps/native`) create a `.env.local` file
using the `.example.env` as a template and fill out your Convex
environment variables.

- Use the `CONVEX_URL` from `packages/backend/.env.local` for
  `{NEXT,EXPO}_PUBLIC_CONVEX_URL`.

### 4. Run both apps

Run the following command to run both the web and mobile apps:

```sh
npm run dev
```

This will allow you to use the ⬆ and ⬇ keyboard keys to see logs for each
of the Convex backend, web app, and mobile app separately.
If you'd rather see all of the lod gs in one place, delete the
`"ui": "tui",` line in [turbo.json](./turbo.json).

## What's inside?

This monorepo template includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js 14](https://nextjs.org/) app with TailwindCSS
- `native`: a [React Native](https://reactnative.dev/) app built with
  [expo](https://docs.expo.dev/) and NativeWind
- `packages/backend`: a [Convex](https://www.convex.dev/) folder with the
  database schema and shared functions

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

To install a new package, `cd` into that directory, such as [packages/backend](./packages/backend/), and then run `yarn add mypackage@latest`

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting

# What is Convex?

[Convex](https://convex.dev) is a hosted backend platform with a built-in
database that lets you write your
[database schema](https://docs.convex.dev/database/schemas) and
[server functions](https://docs.convex.dev/functions) in
[TypeScript](https://docs.convex.dev/typescript). Server-side database
[queries](https://docs.convex.dev/functions/query-functions) automatically
[cache](https://docs.convex.dev/functions/query-functions#caching--reactivity)
and [subscribe](https://docs.convex.dev/client/react#reactivity) to data,
powering a
[realtime `useQuery` hook](https://docs.convex.dev/client/react#fetching-data)
in our [React client](https://docs.convex.dev/client/react). There are also
clients for [Python](https://docs.convex.dev/client/python),
[Rust](https://docs.convex.dev/client/rust),
[ReactNative](https://docs.convex.dev/client/react-native), and
[Node](https://docs.convex.dev/client/javascript), as well as a straightforward
[HTTP API](https://github.com/get-convex/convex-js/blob/main/src/browser/http_client.ts#L40).

The database supports
[NoSQL-style documents](https://docs.convex.dev/database/document-storage) with
[relationships](https://docs.convex.dev/database/document-ids) and
[custom indexes](https://docs.convex.dev/database/indexes/) (including on fields
in nested objects).

The [`query`](https://docs.convex.dev/functions/query-functions) and
[`mutation`](https://docs.convex.dev/functions/mutation-functions) server
functions have transactional, low latency access to the database and leverage
our [`v8` runtime](https://docs.convex.dev/functions/runtimes) with
[determinism guardrails](https://docs.convex.dev/functions/runtimes#using-randomness-and-time-in-queries-and-mutations)
to provide the strongest ACID guarantees on the market: immediate consistency,
serializable isolation, and automatic conflict resolution via
[optimistic multi-version concurrency control](https://docs.convex.dev/database/advanced/occ)
(OCC / MVCC).

The [`action` server functions](https://docs.convex.dev/functions/actions) have
access to external APIs and enable other side-effects and non-determinism in
either our [optimized `v8` runtime](https://docs.convex.dev/functions/runtimes)
or a more
[flexible `node` runtime](https://docs.convex.dev/functions/runtimes#nodejs-runtime).

Functions can run in the background via
[scheduling](https://docs.convex.dev/scheduling/scheduled-functions) and
[cron jobs](https://docs.convex.dev/scheduling/cron-jobs).

Development is cloud-first, with
[hot reloads for server function](https://docs.convex.dev/cli#run-the-convex-dev-server)
editing via the [CLI](https://docs.convex.dev/cli). There is a
[dashboard UI](https://docs.convex.dev/dashboard) to
[browse and edit data](https://docs.convex.dev/dashboard/deployments/data),
[edit environment variables](https://docs.convex.dev/production/environment-variables),
[view logs](https://docs.convex.dev/dashboard/deployments/logs),
[run server functions](https://docs.convex.dev/dashboard/deployments/functions),
and more.

There are built-in features for
[reactive pagination](https://docs.convex.dev/database/pagination),
[file storage](https://docs.convex.dev/file-storage),
[reactive search](https://docs.convex.dev/text-search),
[https endpoints](https://docs.convex.dev/functions/http-actions) (for
webhooks),
[streaming import/export](https://docs.convex.dev/database/import-export/), and
[runtime data validation](https://docs.convex.dev/database/schemas#validators)
for [function arguments](https://docs.convex.dev/functions/args-validation) and
[database data](https://docs.convex.dev/database/schemas#schema-validation).

Everything scales automatically, and it’s
[free to start](https://www.convex.dev/plans).

JWKS={"keys":[{"use":"sig","kty":"RSA","n":"n1A9TzHEJmlgjNZj99a5wYAt-_8k-OXXjTyNOlm5hvjTW5e7rGMP2jAYrh2NFgqgf3Kg3nomeh3AP7mbl5xjKzfCI3cIC27baQITRlmtTUwVMS5DuwX0YJj8PiXGMZrjT3WpbcJimUSYQigJT4E5J6xXL738zb7_7wmF25t0mtHTAgdWYuMhvqEnnrOaQO9ofiU86W9TnIyPWDiNvOPaGXpNSoSWgw6do7XahYlD_xpt3sZw8w81UyRNDt97rfiQfDc4JS6kQMa7sS6-njJRqqziM3cChjTL2M7XU-WhUYKScJ7wx-frEwP8R-EVpO0swfDJ0NztB6L0Hbni5gWIbQ","e":"AQAB"}]}
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCfUD1PMcQmaWCM 1mP31rnBgC37/yT45deNPI06WbmG+NNbl7usYw/aMBiuHY0WCqB/cqDeeiZ6HcA/ uZuXnGMrN8IjdwgLbttpAhNGWa1NTBUxLkO7BfRgmPw+JcYxmuNPdaltwmKZRJhC KAlPgTknrFcvvfzNvv/vCYXbm3Sa0dMCB1Zi4yG+oSees5pA72h+JTzpb1OcjI9Y OI2849oZek1KhJaDDp2jtdqFiUP/Gm3exnDzDzVTJE0O33ut+JB8NzglLqRAxrux Lr6eMlGqrOIzdwKGNMvYztdT5aFRgpJwnvDH5+sTA/xH4RWk7SzB8MnQ3O0HovQd ueLmBYhtAgMBAAECggEABN8gkEjj7mOQmNIuanYYkMgbeXhR1RNFHrC/wcCos7qX zucrZwTadoreCQBzmT1hnglo3sfwCu/Y9hfC2+NKL4/3seYAJKzS+cZaxWZy8oC4 udej1BsBAjX7ZbSTiLOnTOxt/yKYD7p+FQZ5QZygnTrKh5f5gqun5A8Np8li28rL R9clZ3CxzVFsMTujn/x1zloEO4LiWVOFez2ox1+mHB/Q98tDDkcV6YFZyjykAK7t xXSXLuRxzbBJSHqbJG5X0JtqTEBxniwpcb8aN8lgp27ZM1I2Q+91Ypn5KZrZNYHo uDTpzNf7i22Hy+9bSYxaTwAZyDJVjQrNgJYgDhp1IwKBgQDME/Rd5lUzAetBUFW6 ziNureKDSH/bsGZZkDcOh3ILdw90R/xPsrH9nrkkbuiqCi5+s+Q93b9t5vJ9fUr0 zz+gOoWUxUQCEBT/xEpYFd6N2QoVxtUihvV5goWUZghftpZFx5JDnL++ryQ4xRFL H+xwI4eUELlZEFcrhDlFiP7KcwKBgQDH2KyAt48OOVqqKYNkU7tSz2Szzeci3shd g5PbfFRcQvgcSC+6ThShehbOLqOV5DaRMIAoFjk8vKxwSBQfKfxgWTHUz5nDhCAb CXmXVN5v1d9V6+894+LZvZaWqJeqKecdKelucsRqpoMO1RIr9OD5B6cJBz0CepzT gYWKTglJnwKBgFzHmapzBDsLXUw1XLRv8VXpQfjTpiVXvkBru0wksemaeHEyJPiK 0jbuyVdSAP8FX/wEhvjFbrllbMs2gjRoYJHU6VQolvGlJBbfw7jmQGcWzGn4Gn/3 AXT7rQU5mgcBuLICuHF6uwXTFFGm7mTMH68fyAy9ybY/IpJLK8p8LPIXAoGAU5eh SFH/h66b6vNkX1Ha2B+h+sfUt7RCUUNZVISj8NeeWo4jUKWaYZTk9ydxC6Ci5oZI BPyOwoYVBv5PVF3GkDKe8mpH4g1hNI35C0DXriXivljrAJNS70srMyegEPBoGL3Q Q3/EAuxVg53CdRqABAqcZt1dOq047guOZTSRE/cCgYEAne6cKYkyyuujJmWhCThY wqO/tCASt3AbX6wLb4U/hWA+L0EP1PCxkuRqU3X4ReZOyAjrHnKMvNtvGOCwCJil KopjMZ0+WnI9FJrzIbcowCiFKaCq77Jkp+yVq3kWhERcPQMeb1GgLG1mhqNn0jWp C9egAiMXQ27rlHse6qcdHpo= -----END PRIVATE KEY-----
SITE_URL=https://www.ppt.lol
