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

1. **Install dependencies and start the app** using the Bash tool — in this exact order:
   - From the repo root:
     1. Run `npm ci || npm install`. Wait for the command to finish completely; do not continue until dependencies are installed.
     2. Start the dev server in the background: `npm run dev -- --host 0.0.0.0 --port 4173`.  
   - After starting the server, **wait until** `http://localhost:4173/` is actually responding:
     - periodically call Bash with `curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/` (or an equivalent command);
     - only continue when the HTTP status code is `200`.  
   - If the server does not start (several attempts and still no `200`), print `"Dev server on http://localhost:4173/ did not start successfully"` and stop. **Do not** fall back to any other URLs (such as `http://example.com/`).

2. Once the server consistently responds on `http://localhost:4173/`, use **only this URL** with Playwright MCP:
   - Call **mcp__playwright__browser_navigate** with `url` = `${{ github.event.inputs.url }}` (for the local dev server, this should be `http://localhost:4173/`);
   - Then call **mcp__playwright__browser_take_screenshot** with:
     - `type`: `"png"`;
     - optionally `fullPage`: `true`.  
   Do **not** specify a `filename`; let Playwright MCP choose a path within its output directory.

3. After that, say:  
   `"Done. Playwright MCP opened the page and took a screenshot (saved under the MCP output directory / agent artifacts)."`

If the tools **mcp__playwright__browser_navigate** or **mcp__playwright__browser_take_screenshot** are not in your tool list, say:  
`"Playwright MCP is not available — tools mcp__playwright__browser_navigate / mcp__playwright__browser_take_screenshot were not found."` and stop. Do not try to use curl or any other method.

