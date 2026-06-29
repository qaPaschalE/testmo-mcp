#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TestmoClient } from "./testmo-client.js";
import { TOOLS } from "./tools.js";

// ─── Bootstrap client ─────────────────────────────────────────────────────────

const TESTMO_URL = process.env.TESTMO_URL;
const TESTMO_TOKEN = process.env.TESTMO_TOKEN;

let client;
try {
  client = new TestmoClient(TESTMO_URL, TESTMO_TOKEN);
} catch (err) {
  console.error(`[testmo-mcp] Startup error: ${err.message}`);
  console.error(
    "[testmo-mcp] Set TESTMO_URL and TESTMO_TOKEN environment variables before starting."
  );
  process.exit(1);
}

// ─── MCP Server ───────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "testmo-mcp",
  version: "1.0.0",
});

// Register all tools dynamically
for (const tool of TOOLS) {
  server.tool(tool.name, tool.description, tool.inputSchema.shape, async (args) => {
    try {
      const result = await tool.handler(client, args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  });
}

// ─── Start server ─────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[testmo-mcp] Server running on stdio. Ready for connections.");
