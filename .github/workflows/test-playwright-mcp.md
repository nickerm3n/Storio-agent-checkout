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

1. Use the **Playwright MCP** tools to:
   - Call **mcp__playwright__browser_navigate** with `url` = `${{ github.event.inputs.url }}`;
   - Then call **mcp__playwright__browser_take_screenshot** with:
     - `type`: `"png"`;
     - `filename`: `"playwright-mcp-test.png"`;
     - optionally `fullPage`: `true`.

2. After that, say:  
   `"Done. Playwright MCP opened the page and saved screenshot to playwright-mcp-test.png (under the MCP output directory)."`

If the tools **mcp__playwright__browser_navigate** or **mcp__playwright__browser_take_screenshot** are not in your tool list, say:  
`"Playwright MCP is not available — tools mcp__playwright__browser_navigate / mcp__playwright__browser_take_screenshot were not found."` and stop. Do not try to use curl or any other method.

