# Ethereum Block Monitor

A React app that displays the latest Ethereum block numbers for Sepolia (testnet) and Mainnet, using two different data-fetching patterns.

## Stack

- React 19 + TypeScript
- Redux Toolkit (state management)
- Vite (build tool)

## Architecture

- **Context Provider** — `SepoliaBlockProvider` polls the Sepolia block number API every 60 seconds, dispatches to Redux, and exposes the value via React Context.
- **Custom Hook** — `useMainnetBlockNumber` polls the Mainnet block number API every 30 seconds, dispatches to Redux, and returns the value directly.
- **Redux** — Single `blockNumberSlice` stores both block numbers with loading and error states.
- **API layer** — Shared `fetchLatestBlockNumber` function used by both patterns.

## Setup

```bash
npm install
npm run dev
```

## Dev Proxy

The API at `zazen.okanelabs.com` does not include CORS headers. Vite's dev server proxies `/api` requests to the API origin to work around this. See `vite.config.ts` for the proxy configuration.
