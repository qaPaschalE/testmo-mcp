# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm start            # run the MCP server (requires env vars)
npm run dev          # run with auto-reload on file changes
```

The server requires two environment variables at startup:

```bash
TESTMO_URL=https://your-instance.testmo.net \
TESTMO_TOKEN=your-api-token \
npm start
```

There are no tests or linting configured.

## Architecture

This is a single-process MCP server that bridges Claude to the Testmo test management REST API via stdio transport.

**Data flow:** Claude → MCP stdio → `src/index.js` → `TestmoClient` → Testmo REST API

**Three files, three responsibilities:**

- **`src/testmo-client.js`** — `TestmoClient` class. All HTTP calls go here. Normalizes the base URL to `/api/v1`, uses Bearer token auth, and throws descriptive errors on non-2xx responses.
- **`src/tools.js`** — Exports a `TOOLS` array. Each entry is a plain object with `name`, `description`, an `inputSchema` (Zod object), and a `handler(client, args)` async function. This is the only file that needs to change when adding or modifying tools.
- **`src/index.js`** — Reads env vars, constructs `TestmoClient`, iterates `TOOLS` to register each with `server.tool()`, then connects to stdio. No business logic lives here.

**Adding a new tool:** add a method to `TestmoClient`, then add an entry to the `TOOLS` array in `tools.js`. The registration loop in `index.js` picks it up automatically.

**Zod schemas** are used for input validation and MCP schema generation. `inputSchema.shape` is passed directly to `server.tool()` — the MCP SDK reads the Zod shape to produce the JSON Schema exposed to Claude.

## Test Status IDs

| ID | Status |
|----|--------|
| 1  | Passed |
| 2  | Failed |
| 3  | Blocked |
| 4  | Skipped |
| 5  | Untested |
