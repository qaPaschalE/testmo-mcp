# testmo-mcp

[![CI](https://github.com/qaPaschalE/testmo-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/qaPaschalE/testmo-mcp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/testmo-mcp?logo=npm&logoColor=white)](https://www.npmjs.com/package/testmo-mcp)
[![npm downloads](https://img.shields.io/npm/dm/testmo-mcp?logo=npm&logoColor=white&color=orange)](https://www.npmjs.com/package/testmo-mcp)
[![Node](https://img.shields.io/node/v/testmo-mcp?logo=nodedotjs&logoColor=white&label=node)](https://nodejs.org)
[![License](https://img.shields.io/github/license/qaPaschalE/testmo-mcp?color=green)](./LICENSE)
[![MCP](https://img.shields.io/badge/MCP-compatible-blueviolet)](https://modelcontextprotocol.io)
[![Tools](https://img.shields.io/badge/tools-28-orange)](https://github.com/qaPaschalE/testmo-mcp#tools)
[![AI clients](https://img.shields.io/badge/AI%20clients-12-informational)](https://github.com/qaPaschalE/testmo-mcp#supported-clients-at-a-glance)
[![ESM](https://img.shields.io/badge/module-ESM-yellow)](https://nodejs.org/api/esm.html)
[![Testmo API](https://img.shields.io/badge/Testmo%20API-v1-red)](https://testmo.com)
[![SDK](https://img.shields.io/badge/%40modelcontextprotocol%2Fsdk-1.29.0-blueviolet?logo=anthropic)](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
[![Zod](https://img.shields.io/badge/zod-4.4.3-3E67B1?logo=zod)](https://zod.dev)

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that connects Claude to your [Testmo](https://testmo.com) instance. Ask Claude in natural language to manage test runs, review test results, submit automation results from CI, and more — without leaving your workflow.

---

## What you can do

Once connected, you can talk to Claude like:

> _"List all active test runs in project 3"_
> _"Create a new milestone called 'Sprint 22' due July 15th"_
> _"Show me failed tests in run 47"_
> _"Start an automation thread, submit these results, then mark it complete"_
> _"Read this PRD and generate test cases for each acceptance criterion in folder 29916"_
> _"List all folders in project 19, create a new folder called 'Benefits V2', then move these cases into it"_
> _"What templates and custom fields are available in project 5?"_

---

## Tools

### Projects

| Tool            | Description                                   |
| --------------- | --------------------------------------------- |
| `list_projects` | List all projects accessible to the API token |
| `get_project`   | Get details of a specific project             |

### Milestones

| Tool               | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `list_milestones`  | List milestones for a project                               |
| `get_milestone`    | Get a specific milestone                                    |
| `create_milestone` | Create a new milestone (name, description, start/due dates) |
| `update_milestone` | Update name, dates, or mark as completed                    |

### Test Runs

| Tool         | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `list_runs`  | List runs for a project, with optional milestone/status filters |
| `get_run`    | Get run details including stats and status                      |
| `create_run` | Create a new test run                                           |
| `update_run` | Rename, change milestone, add refs, or close a run              |
| `delete_run` | Permanently delete a run                                        |

### Test Results

| Tool           | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `list_results` | List test results inside a run, with optional status filter |
| `get_result`   | Get a single test result by ID                              |

### Test Cases (Repository)

| Tool           | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| `list_cases`   | List test cases in a project, optionally filtered by folder           |
| `create_cases` | Create one or more test cases — use this to generate cases from a PRD |
| `update_cases` | Bulk-update cases: move to a folder, change priority, etc.            |
| `delete_cases` | Permanently delete test cases by ID                                   |

### Folders

| Tool             | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `list_folders`   | List all folders in a project repo with case counts   |
| `create_folders` | Create folders to organise cases by feature or sprint |
| `update_folders` | Rename folders or move them under a parent folder     |
| `delete_folders` | Permanently delete folders and all cases inside them  |

### Project Metadata

| Tool             | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `list_templates` | List case templates (BDD, Steps, Text) and their field definitions |
| `list_tags`      | List all tags in a project with usage counts                       |
| `list_fields`    | List custom fields configured in a project                         |
| `list_sessions`  | List exploratory test sessions                                     |

### CI / Automation

| Tool                         | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `start_automation_thread`    | Open an automation thread in a run (returns a thread ID) |
| `submit_automation_results`  | Submit an array of test results to a thread              |
| `complete_automation_thread` | Close the thread after all results are submitted         |

---

## Setup

### Step 1 — Get your Testmo API token

1. Log into your Testmo instance
2. Click your avatar → **Profile** → **API Tokens**
3. Click **Add API Token**, name it, and copy the value

> The token is only shown once. Store it somewhere safe.

### Step 2 — Install the package

**Option A — Global install (recommended)**

```bash
npm install -g testmo-mcp
```

Then replace `npx -y testmo-mcp@latest` with just `testmo-mcp` in any config block below.

**Option B — No install needed**

Use `npx` to pull and run on demand — no install required:

The config block is the same for most tools — only the file location differs:

```json
{
  "mcpServers": {
    "testmo-mcp": {
      "command": "npx",
      "args": ["-y", "testmo-mcp@latest"],
      "env": {
        "TESTMO_URL": "https://your-instance.testmo.net",
        "TESTMO_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

#### Claude Desktop

| OS      | Config file                                                       |
| ------- | ----------------------------------------------------------------- |
| macOS   | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json`                     |
| Linux   | `~/.config/claude-desktop/claude_desktop_config.json`             |

Paste the config block above into the file, then **fully quit and reopen** Claude Desktop.

---

#### Claude Code (CLI)

```bash
# If installed globally (npm install -g testmo-mcp)
claude mcp add testmo-mcp \
  -e TESTMO_URL=https://your-instance.testmo.net \
  -e TESTMO_TOKEN=your-api-token \
  -- testmo-mcp

# Or with npx (no install needed)
claude mcp add testmo-mcp \
  -e TESTMO_URL=https://your-instance.testmo.net \
  -e TESTMO_TOKEN=your-api-token \
  -- npx -y testmo-mcp@latest
```

Or for a project-scoped setup, add to `.mcp.json` at the repo root:

```json
{
  "mcpServers": {
    "testmo-mcp": {
      "command": "npx",
      "args": ["-y", "testmo-mcp@latest"],
      "env": {
        "TESTMO_URL": "https://your-instance.testmo.net",
        "TESTMO_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

#### Cursor

| Scope                 | Config file                          |
| --------------------- | ------------------------------------ |
| Global (all projects) | `~/.cursor/mcp.json`                 |
| Project only          | `.cursor/mcp.json` in your repo root |

Paste the config block, then open **Cursor Settings → MCP** and enable the server.

---

#### Windsurf

Config file: `~/.codeium/windsurf/mcp_config.json`

> Create this file manually if it doesn't exist.

Paste the config block, then restart Windsurf. The server appears under **Cascade → MCP Servers**.

---

#### Zed

Zed uses a different root key (`context_servers` instead of `mcpServers`). Add this to `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "testmo-mcp": {
      "command": {
        "path": "npx",
        "args": ["-y", "testmo-mcp@latest"]
      },
      "env": {
        "TESTMO_URL": "https://your-instance.testmo.net",
        "TESTMO_TOKEN": "your-api-token"
      }
    }
  }
}
```

For project-scoped config, use `.zed/settings.json` in your repo root instead.

---

#### Continue.dev (VS Code / JetBrains)

Create `.continue/mcpServers/testmo-mcp.json` in your project root (or `~/.continue/mcpServers/testmo-mcp.json` globally):

```json
{
  "mcpServers": {
    "testmo-mcp": {
      "command": "npx",
      "args": ["-y", "testmo-mcp@latest"],
      "env": {
        "TESTMO_URL": "https://your-instance.testmo.net",
        "TESTMO_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

#### Cline (VS Code extension)

1. Open VS Code and click the **Cline** icon in the sidebar
2. Click the **MCP Servers** icon (plug icon) at the top of the Cline panel
3. Click **Configure MCP Servers** — this opens the JSON config file
4. Paste the config block and save

---

#### GitHub Copilot (VS Code)

Add to your VS Code `settings.json` (open via **Cmd/Ctrl+Shift+P → Open User Settings JSON**):

```json
{
  "mcp": {
    "servers": {
      "testmo-mcp": {
        "command": "npx",
        "args": ["-y", "testmo-mcp@latest"],
        "env": {
          "TESTMO_URL": "https://your-instance.testmo.net",
          "TESTMO_TOKEN": "your-api-token"
        }
      }
    }
  }
}
```

Then open GitHub Copilot Chat, switch to **Agent mode**, and the testmo tools will be available.

---

#### Amazon Q Developer

| Scope   | Config file                           |
| ------- | ------------------------------------- |
| Global  | `~/.aws/amazonq/mcp.json`             |
| Project | `.amazonq/mcp.json` in your repo root |

Paste the config block. The tools appear automatically in the Q Developer chat panel.

---

#### Kimi Code (CLI)

| Scope   | Config file                             |
| ------- | --------------------------------------- |
| Global  | `~/.kimi-code/mcp.json`                 |
| Project | `.kimi-code/mcp.json` in your repo root |

Paste the config block, or run `/mcp-config` inside the Kimi Code TUI to configure interactively.

---

#### Gemini CLI

Add to your Gemini CLI config at `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "testmo-mcp": {
      "command": "npx",
      "args": ["-y", "testmo-mcp@latest"],
      "env": {
        "TESTMO_URL": "https://your-instance.testmo.net",
        "TESTMO_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

#### ChatGPT (Desktop)

1. Open ChatGPT Desktop → **Settings → Integrations**
2. Click **Add MCP Server**
3. Set Command to `npx` and Args to `-y testmo-mcp@latest`
4. Add `TESTMO_URL` and `TESTMO_TOKEN` as environment variables

> MCP in ChatGPT Desktop requires a **Plus, Pro, or Team** plan.

---

### Supported clients at a glance

| Client          | Config format     | Config location                         | Notes                         |
| --------------- | ----------------- | --------------------------------------- | ----------------------------- |
| Claude Desktop  | JSON              | `~/Library/Application Support/Claude/` | Restart required              |
| Claude Code CLI | CLI / `.mcp.json` | Repo root or global                     | `claude mcp add` command      |
| Cursor          | JSON              | `~/.cursor/mcp.json`                    | Global or per-project         |
| Windsurf        | JSON              | `~/.codeium/windsurf/mcp_config.json`   | Create file manually          |
| Zed             | JSON              | `~/.config/zed/settings.json`           | Uses `context_servers` key    |
| Continue.dev    | JSON              | `.continue/mcpServers/`                 | Per-project or global         |
| Cline           | JSON              | UI-managed                              | Configure via extension panel |
| GitHub Copilot  | JSON              | VS Code `settings.json`                 | Agent mode only               |
| Amazon Q        | JSON              | `~/.aws/amazonq/mcp.json`               | Global or per-project         |
| Kimi Code       | JSON              | `~/.kimi-code/mcp.json`                 | `/mcp-config` TUI available   |
| Gemini CLI      | JSON              | `~/.gemini/settings.json`               | CLI tool only                 |
| ChatGPT Desktop | UI                | Settings → Integrations                 | Plus/Pro/Team plans only      |

---

## Running locally

```bash
# Install dependencies
npm install

# Run the server
TESTMO_URL=https://your-instance.testmo.net \
TESTMO_TOKEN=your-token \
npm start

# Auto-reload during development
TESTMO_URL=https://your-instance.testmo.net \
TESTMO_TOKEN=your-token \
npm run dev
```

---

## Testing the server

### Option A — MCP Inspector (recommended for development)

```bash
npx @modelcontextprotocol/inspector \
  -e TESTMO_URL=https://your-instance.testmo.net \
  -e TESTMO_TOKEN=your-token \
  npx testmo-mcp@latest
```

Opens a browser UI where you can call any tool interactively and inspect the raw JSON response.

### Option B — Smoke test (no API calls)

Verify the server starts and registers all tools without crashing:

```bash
TESTMO_URL=https://example.testmo.net TESTMO_TOKEN=fake npx testmo-mcp
# Expected: [testmo-mcp] Server running on stdio. Ready for connections.
```

---

## Generating test cases from a PRD

Use `list_cases` to check existing coverage, then `create_cases` to write new ones in bulk. Claude reads your PRD and creates one case per acceptance criterion, populating description, preconditions, and expected results automatically.

Example prompt:

> _"Here is our PRD [paste or attach]. List existing cases in project 19, folder 29916, then create test cases for any user stories not already covered — use the user story as the description, the given/when conditions as preconditions, and each acceptance criterion as the expected result."_

Each created case supports these fields:

| Field                 | Maps to                               |
| --------------------- | ------------------------------------- |
| `name`                | Test case title                       |
| `custom_description`  | Background / user story               |
| `custom_precondition` | Given / setup conditions              |
| `custom_expected`     | Expected result / acceptance criteria |

To clean up cases Claude generated that you don't want, use `delete_cases` with the IDs returned from the create response.

---

## CI/CD automation flow

Use the three automation tools together to submit test results from a pipeline:

```
1. create_run                → get run_id
2. start_automation_thread   → get thread_id
3. submit_automation_results (can be called multiple times)
4. complete_automation_thread
```

Example prompt to Claude:

> _"Create a run called 'Nightly CI — June 29' in project 2, start an automation thread named 'E2E Suite', submit these results: [login passed 1200ms, checkout failed 'assertion error'], then complete the thread."_

### Test status IDs

| ID  | Status   |
| --- | -------- |
| 1   | Passed   |
| 2   | Failed   |
| 3   | Blocked  |
| 4   | Skipped  |
| 5   | Untested |

---

## Project structure

```
src/
├── index.js          # MCP server entry point — registers tools and connects via stdio
├── testmo-client.js  # HTTP client for the Testmo REST API
└── tools.js          # All tool definitions (name, schema, handler)
```

**Adding a new tool:** add a method to `TestmoClient` in `testmo-client.js`, then add an entry to the `TOOLS` array in `tools.js`. The registration loop in `index.js` picks it up automatically.

---

## Troubleshooting

**`TESTMO_URL and TESTMO_TOKEN environment variables are required`**
→ Both env vars must be set before starting the server.

**API 401 errors**
→ Token is expired or has insufficient permissions. Regenerate it in Testmo under Profile → API Tokens.

**API 404 errors**
→ Check that `TESTMO_URL` is your full instance URL, e.g. `https://acme.testmo.net` (no trailing slash, no path).

**Tools not appearing in Claude**
→ Fully restart Claude Desktop (quit from the menu bar, not just close the window). For other clients, check that `npx` is available in your system PATH.

---

## Author

Built by [@qaPaschalE](https://github.com/qaPaschalE)

---

## License

MIT
