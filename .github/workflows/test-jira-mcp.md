---
description: "Smoke test: run agent with only one task — call Jira MCP add_comment. Use to verify Jira MCP is available and auth works."
on:
  workflow_dispatch:
    inputs:
      jira_key:
        description: "Jira issue key to post a test comment (e.g. DEV-1)"
        required: true
        type: string

permissions:
  contents: read

mcp-servers:
  jira:
    command: "npx"
    args: ["-y", "@orengrinker/jira-mcp-server"]
    env:
      JIRA_BASE_URL: "https://agent-ai-poc.atlassian.net"
      JIRA_EMAIL: "${{ secrets.JIRA_EMAIL }}"
      JIRA_API_TOKEN: "${{ secrets.JIRA_API_TOKEN }}"
    allowed:
      - add_comment

network:
  allowed:
    - defaults
    - "*.atlassian.net"

engine: claude
---

# Test Jira MCP

You have **one task only**. Do nothing else.

1. Call the **Jira MCP** tool to add a comment to the Jira issue.
   - **Issue key:** ${{ github.event.inputs.jira_key }}
   - **Comment body:** `[MCP test] Jira MCP add_comment succeeded.`
   - Use the exact tool name: **mcp__jira__add_comment**. The parameters are: issue key = the jira_key above, and the comment text (body).

2. After calling the tool, say "Done. Check the Jira issue for the test comment." and stop.

If the tool **mcp__jira__add_comment** is not in your tool list, say: "Jira MCP is not available — the tool mcp__jira__add_comment was not found." and stop. Do not try to use curl or any other method.
