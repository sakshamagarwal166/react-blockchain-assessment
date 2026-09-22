# AI Prompts & Responses

This document records every prompt and response from the AI-assisted development of this project, as required by the coding assessment (Bonus item 3).

---

## Prompt 1

**User:**
> explain the requirements

**AI Response:**
The repo is essentially empty (just a gitignore and README). The assessment asks to build a React app using Node.js, React, and Redux (required), with Vite as an optional bundler. Two features:

**1. Context Provider — Sepolia Block Number (polls every 60s)**
- Create a React Context Provider that fetches the latest Ethereum Sepolia testnet block number from `https://zazen.okanelabs.com/ethereum/sepolia/block/number/latest`
- Poll that endpoint every 1 minute
- Display the block number in the UI via context consumers

**2. Custom Hook — Mainnet Block Number (polls every 30s)**
- Create a custom React hook (e.g., `useBlockNumber`) that fetches the latest Ethereum mainnet block number from `https://zazen.okanelabs.com/ethereum/mainnet/block/number/latest`
- Poll that endpoint every 30 seconds
- Display the block number in the UI via the hook

**Key evaluation criteria:**
- Code architecture — clean separation of concerns, good file/folder organization
- Functionality — both polling mechanisms work correctly
- Two different patterns demonstrated: Context API (task 1) vs. custom hook (task 2)
- Redux is in the required stack, so it should be integrated

**Bonus:** They want to see the AI prompts used to generate the code, so we should document that as well.

---

## Prompt 2

**User:**
> Before we start implementing, let's settle the architecture. One thing I want to be careful about is using Redux, Context, and the custom hook without unnecessarily duplicating state. How would you separate their responsibilities here? Also suggest the folder structure you'd use. Keep it simple and avoid over-engineering.

**AI Response:**
Recommended Redux as the single source of truth for both block numbers with two slices (or one slice with two fields): `sepoliaBlockNumber` and `mainnetBlockNumber`.

- **Context Provider** (task 1) — fetches Sepolia data every 60s, dispatches to Redux, and exposes the value from Redux via context. The context itself holds no independent state — it's a thin wrapper that owns the polling lifecycle.
- **Custom Hook** (task 2) — `useMainnetBlockNumber()` sets up the 30s polling, dispatches to Redux, and returns the value from `useSelector`. No local `useState` for the block number.

Zero duplication: Redux stores it, the context/hook are just different access patterns that also own their respective polling side effects.

Proposed folder structure:
```
src/
  api/
    blockNumber.ts
  store/
    index.ts
    blockNumberSlice.ts
  context/
    SepoliaBlockProvider.tsx
  hooks/
    useMainnetBlockNumber.ts
  components/
    SepoliaBlock.tsx
    MainnetBlock.tsx
  App.tsx
  main.tsx
```

One shared API module, one Redux slice, then each feature in its own folder by pattern type. Noted that the context provider is slightly redundant with Redux here (consumers could just use `useSelector` directly), but the assessment explicitly asks for a context provider, so the context serves as the polling orchestrator and a demonstration of the pattern.

---

## Prompt 3

**User:**
> I like this approach. Before we implement it, one thing I'm wondering about: does Redux need to be the source of truth for the block numbers, or can we use Redux for the application state while letting the Context and hook manage their own values? Which approach would be cleaner for this assessment and why?

**AI Response:**
Recommended separated ownership — let each pattern manage its own state directly:

- **Context Provider** owns Sepolia block number in `useState`, exposes it via context
- **Custom Hook** owns mainnet block number in `useState`, returns it directly
- **Redux** stores something that genuinely benefits from it — like a log of recent block updates, or user preferences

Why this is cleaner:
1. No forced indirection — routing context/hook state through Redux just to read it back out adds dispatch/selector plumbing with zero benefit
2. Each pattern stands on its own — the assessment wants to see Context and hooks as real patterns, not thin wrappers around Redux
3. Redux gets a real job — like persisting a history of block numbers or cross-cutting app state

Suggested a `blockHistory` slice that both the context provider and the hook dispatch to when they get a new value.

---

## Prompt 4

**User:**
> I agree with keeping the current block values owned by the context and hook. I'm not convinced we need to add block history just to justify Redux though. Can you suggest the simplest meaningful way to use Redux in this app without adding unnecessary functionality?

**AI Response:**
Suggested Redux own the polling configuration — both features need a polling interval and an on/off toggle. That's shared app state that a user action can change.

```
store/
  pollingSlice.ts
    state: {
      sepolia: { interval: 60000, enabled: true }
      mainnet: { interval: 30000, enabled: true }
    }
    actions: togglePolling, setInterval
```

The context provider and hook read these values via `useSelector` and use them to control their `setInterval`. A couple of toggle buttons in the UI let users pause/resume or adjust frequency. Redux manages state that's genuinely global, the context and hook remain owners of their block number values, no invented features, and it's just a few lines of Redux.

---

## Prompt 5

**User:**
> I agree Redux should have a real purpose, but I don't want to add controls or change the required polling intervals just to use Redux. Can we keep the UI focused on the assessment and use Redux in a minimal way? Maybe consider whether Redux should own the block data while Context and the custom hook handle the different access/fetching patterns. What would you recommend?

**AI Response:**
Came back to Redux as the data store, with a clear distinction:

- **Redux** stores both block numbers. That's it — it's the state container.
- **Context Provider** owns the Sepolia polling lifecycle, dispatches to Redux, exposes the value from the store via context. Components consume context.
- **Custom Hook** owns the mainnet polling lifecycle, dispatches to Redux, returns the value from the store. Components call the hook.

This is clean because:
- Redux does what Redux does — holds application state
- Context and the hook aren't thin wrappers — they each own their fetching/polling logic, which is the interesting part. They just don't duplicate the storage.
- No invented features, no extra UI, no polling controls

The two patterns differ in how consumers access the data (context subscription vs. hook call) and how the polling is orchestrated (provider mount vs. hook mount), which is exactly what the assessment wants to see.

---

## Prompt 6

**User:**
> Yes, let's build it this way. Start by scaffolding the Vite + React + TypeScript project and set up Redux Toolkit. Then create the basic folder structure, store, API service, Sepolia context and mainnet hook. Keep the implementation simple and don't add any features beyond the assessment. Once the basic structure is in place, show me what you've created before we move on to the UI.

**AI Response:**
Scaffolded a Vite + React + TypeScript project. Installed `@reduxjs/toolkit` and `react-redux`. Created the folder structure and all core files:

- `src/api/blockNumber.ts` — single `fetchLatestBlockNumber(network)` function used by both features
- `src/store/index.ts` — `configureStore` with typed exports (`RootState`, `AppDispatch`)
- `src/store/blockNumberSlice.ts` — Redux slice: `sepolia` and `mainnet` block numbers
- `src/store/hooks.ts` — typed `useAppDispatch`/`useAppSelector` using `withTypes`
- `src/context/SepoliaBlockProvider.tsx` — provider with 60s polling, dispatches to Redux, exposes value via context. Exports `useSepoliaBlock()` for consumers.
- `src/hooks/useMainnetBlockNumber.ts` — hook with 30s polling, dispatches to Redux, returns block number directly
- `src/main.tsx` — `Provider` (Redux) → `SepoliaBlockProvider` → `App`

Both polling effects use an `active` flag to prevent dispatching after unmount, and `clearInterval` for cleanup. Type check passed clean.

---

## Prompt 7

**User:**
> Before we move to the UI, can you review the core implementation you've just created? Check the API response handling, first fetch + polling intervals, cleanup on unmount, React Strict Mode behavior, Redux typing, and error/loading handling. Also check whether there is any unnecessary complexity or anything that doesn't fully match the assessment. Please fix any issues you find and briefly explain the changes.

**AI Response:**
Tested the actual API endpoints and found several issues:

**1. API response parsing was wrong** — `return data` assumed a bare number, but the API returns `{ status, data: { block_number }, error }`. Fixed to correctly destructure `json.data.block_number`, added a typed `BlockNumberResponse` interface, and added validation of `json.status`.

**2. Redux slice expanded** — Each network now tracks `{ blockNumber, loading, error }` instead of bare `number | null`. Added `setSepoliaError` and `setMainnetError` actions. `loading` starts as `true` and flips to `false` on either success or error.

**3. Context guard was broken** — Default context value was `null` but the check was `=== undefined`, so consumers outside the provider would silently get `null` with no error. Fixed to check `=== null`. Context now exposes the full `{ blockNumber, loading, error }` object.

**4. Error dispatching added** — Fetch errors were only `console.error`'d. Now caught and dispatched to Redux via error actions so the UI can display error states.

**Verified as already correct:**
- Strict Mode — mount/unmount/remount cycle handled: cleanup sets `active = false` and clears interval
- Polling timing — `poll()` fires immediately, then `setInterval` schedules subsequent calls
- Redux typing — `useAppDispatch`/`useAppSelector` with `withTypes` is the recommended RTK pattern

---

## Prompt 8

**User:**
> Let's build the UI now. Keep it simple and focused on the assessment. Create separate components for Sepolia and Mainnet, consume Sepolia through the context and Mainnet through the custom hook, and display the current block number with loading and error states. Remove the default Vite UI.

**AI Response:**
Created the UI components and replaced all Vite starter content:

- `src/components/SepoliaBlock.tsx` — consumes `useSepoliaBlock()` from context, renders block number with loading/error states
- `src/components/MainnetBlock.tsx` — consumes `useMainnetBlockNumber()` hook, same display pattern
- `src/App.tsx` — replaced Vite demo with two block cards in a responsive grid layout
- `src/App.css` — card-based layout styles, responsive grid
- `src/index.css` — stripped down to just base CSS variables and typography
- `vite.config.ts` — added dev proxy for `/api` → `zazen.okanelabs.com` to work around CORS (the API doesn't include `Access-Control-Allow-Origin` headers)
- `src/api/blockNumber.ts` — updated `BASE_URL` to `/api/ethereum` to use the proxy path

Verified in browser: both cards show live block numbers, polling works (numbers update over time), error states display correctly, zero console errors.

---

## Prompt 9

**User:**
> Before we clean anything up or commit, can you do one final review of the current implementation? Check the architecture, Redux/Context/hook responsibilities, polling and cleanup, error/loading handling, and the Vite proxy setup. Also make sure the implementation still matches the assessment exactly and that we haven't added anything unnecessary. Fix any issues you find and then run the build again.

**AI Response:**
Reviewed all files. Only one minor issue: `strictPort: false` in vite config was the default value (unnecessary noise) — removed it.

Everything else verified correct:
- **API parsing** — correctly extracts `json.data.block_number`, validates `json.status`
- **Redux selectors** — `(state) => state.blockNumber.sepolia` returns a stable reference when sepolia hasn't changed (Immer), so the context provider only re-renders when its data actually updates — no unnecessary context propagation from mainnet changes
- **Strict Mode** — mount→unmount→mount is safe: `active` flag prevents orphaned first fetch from dispatching, `clearInterval` stops the orphaned timer
- **Loading semantics** — `loading: true` means "no data yet" (initial state), stays `false` after first success — no loading flash on every poll
- **Context guard** — default `null`, check `=== null`: correctly throws when consumed outside provider
- **Proxy** — `/api` → `https://zazen.okanelabs.com` with path rewrite: correct for dev

Type check and production build both pass clean.

---

## Prompt 10

**User:**
> Great. Let's do the final cleanup now. Remove only the unused Vite starter files/assets, make sure the package name and README are appropriate for the assessment, and document the dev proxy/setup briefly. Don't change any application logic. Run the type check and build after the cleanup.

**AI Response:**
Cleaned up:
- **Removed**: `src/assets/` (hero.png, react.svg, vite.svg), `public/icons.svg` — unused Vite starter assets
- **Kept**: `public/favicon.svg` — still referenced by `index.html`
- **Updated**: `index.html` title → "Ethereum Block Monitor"
- **Updated**: `package.json` name → `react-blockchain-assessment`
- **Replaced**: `README.md` — documents the stack, architecture, setup instructions, and dev proxy explanation

Type check and production build both pass clean.
