# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # Start dev server (Turbopack, http://localhost:3000)
npm run build      # Production build (Turbopack by default)
npm run start      # Start production server
npm run lint       # Run ESLint (next build no longer lints automatically)
```

To use Webpack instead of Turbopack: `next dev --webpack` / `next build --webpack`.

## Stack

- **Next.js 16.2.6** — App Router, Turbopack default, React 19.2
- **TypeScript 5** — strict mode, path alias `@/*` → `./*`
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`, theme tokens via `@theme inline`
- **ESLint v9** — flat config (`eslint.config.mjs`), `eslint-config-next/core-web-vitals` + `typescript`

## Architecture

App Router only (`app/` directory). No `pages/` router. `app/layout.tsx` is the root layout with Geist fonts and global CSS. `app/page.tsx` is the home route.

## Next.js 16 Breaking Changes

Before writing any Next.js code, check `node_modules/next/dist/docs/` for current API docs. Key changes from training data:

**Async-only Request APIs** — `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are now fully async. Synchronous access is removed. Always `await` them:
```ts
// page.tsx, layout.tsx, route.ts
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
}
```
Run `npx next typegen` to generate `PageProps`/`LayoutProps`/`RouteContext` helpers.

**`middleware` → `proxy`** — Rename `middleware.ts` to `proxy.ts` and the exported function to `proxy`. The `edge` runtime is not supported in `proxy` (uses `nodejs`). Config flag `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`.

**Caching APIs** — `revalidateTag` now requires a second `cacheLife` profile argument: `revalidateTag('posts', 'max')`. Use `updateTag` (Server Actions only) for immediate cache expiration with read-your-writes semantics. `cacheLife`/`cacheTag` no longer need the `unstable_` prefix.

**PPR** — `experimental.ppr` removed; use `cacheComponents: true` in `next.config.ts`.

**Turbopack config** — `experimental.turbopack` moved to top-level `turbopack: {}` in `next.config.ts`.

**`next lint` removed** — Use `eslint` directly (already configured in `package.json`). `next build` no longer runs linting.

**Parallel routes** — All `@slot` parallel route folders require an explicit `default.js`/`default.tsx` file or builds fail.

**`next/image` defaults changed** — `minimumCacheTTL` default is now 4 hours (was 60s). `imageSizes` no longer includes 16px. `qualities` defaults to `[75]`. `images.domains` is deprecated — use `remotePatterns`. Local images with query strings require `images.localPatterns.search` config.

**Removed** — AMP support, `serverRuntimeConfig`/`publicRuntimeConfig` (use `process.env`/`NEXT_PUBLIC_`), `next/legacy/image`, `unstable_rootParams`, `devIndicators.appIsrStatus/buildActivity/buildActivityPosition`, `experimental.dynamicIO` (renamed to `cacheComponents`).

**Dev output** — `next dev` outputs to `.next/dev`; `next build` outputs to `.next`. These are now separate directories.
