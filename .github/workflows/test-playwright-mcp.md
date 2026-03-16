---
description: "Smoke test: use Playwright MCP to open a page and take a screenshot."
on:
  workflow_dispatch:
    inputs:
      url:
        description: "URL to open (e.g. http://localhost:4173/ or a deployed preview URL)"
        required: true
        type: string

permissions:
  contents: read

mcp-servers:
  playwright:
    container: "mcr.microsoft.com/playwright/mcp"
    allowed:
      - browser_navigate
      - browser_snapshot
      - browser_take_screenshot

network:
  allowed:
    - defaults
    - "localhost"

engine: claude
---

# Test Playwright MCP

You have **one task only**. Do nothing else.

1. **Start the app** using the Bash tool (so that Playwright has something to open):  
   - From the repo root, run:
     - `npm install` (if node_modules are missing); then
     - `npm run dev -- --host 0.0.0.0 --port 4173`  
       Run the dev server in the background and wait until it is ready to serve on `http://localhost:4173/`.

2. Use the **Playwright MCP** tools to:
   - Call **mcp__playwright__browser_navigate** with `url` = `${{ github.event.inputs.url }}` (for a local dev server, this will be `http://localhost:4173/`);
   - Then call **mcp__playwright__browser_take_screenshot** with:
     - `type`: `"png"`;
     - optionally `fullPage`: `true`.  
   Do **not** specify a `filename`; let Playwright MCP choose a path within its output directory.

3. After that, say:  
   `"Done. Playwright MCP opened the page and took a screenshot (saved under the MCP output directory / agent artifacts)."`

If the tools **mcp__playwright__browser_navigate** or **mcp__playwright__browser_take_screenshot** are not in your tool list, say:  
`"Playwright MCP is not available — tools mcp__playwright__browser_navigate / mcp__playwright__browser_take_screenshot were not found."` and stop. Do not try to use curl or any other method.

