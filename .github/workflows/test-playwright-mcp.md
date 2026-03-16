---
description: "Smoke test: use Playwright MCP to open a page and take a screenshot."
on:
  workflow_dispatch:
    inputs:
      url:
        description: "URL to open (e.g. http://localhost:5173/ or a deployed preview URL)"
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

1. Assume the target application is **already deployed and reachable** at the URL passed in the workflow input `url` (for example a GitHub Pages / preview / production URL).  
   - **Do not** try to install dependencies or start a dev server yourself.  
   - **Do not** call Bash to run `npm run dev`, `curl localhost`, or anything similar.

2. Use Playwright MCP to open the provided URL and take a screenshot:
   - Call **mcp__playwright__browser_navigate** with:
     - `url` = `${{ github.event.inputs.url }}`.
   - Then call **mcp__playwright__browser_take_screenshot** with:
     - `type`: `"png"`;
     - optionally `fullPage`: `true`.  
   Do **not** specify a `filename`; let Playwright MCP choose a path within its output directory.

3. After that, say:  
   `"Done. Playwright MCP opened the page and took a screenshot (saved under the MCP output directory / agent artifacts)."`

If the tools **mcp__playwright__browser_navigate** or **mcp__playwright__browser_take_screenshot** are not in your tool list, say:  
`"Playwright MCP is not available — tools mcp__playwright__browser_navigate / mcp__playwright__browser_take_screenshot were not found."` and stop. Do not try to use curl or any other method.

