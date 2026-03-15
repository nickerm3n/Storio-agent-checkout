---
description: "Agentic workflow: Jira ticket assigned to bot → GitHub Agent creates a Pull Request and notifies Jira via MCP (comment + transition). Trigger via Jira Automation or manually."
on:
  workflow_dispatch:
    inputs:
      jira_key:
        description: "Jira ticket key (e.g. BUY-505)"
        required: true
        type: string
      title:
        description: "Task title from Jira"
        required: true
        type: string
      description:
        description: "Task description / acceptance criteria from Jira"
        required: true
        type: string

permissions:
  contents: read
  pull-requests: read
  issues: read

safe-outputs:
  create-pull-request:
    title-prefix: "[jira] "
    labels: [automation, tech-debt]
    draft: true
    max: 1
    if-no-changes: "warn"
    fallback-as-issue: true
    protected-files: allowed

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
      - transition_issue

# Allow Jira MCP to call Atlassian API (otherwise add_comment/transition_issue are blocked by sandbox)
network:
  allowed:
    - defaults
    - "*.atlassian.net"

engine: claude
---

# Jira → Pull Request (Orchestrator + Development)

You are an AI agent that implements Jira tasks and opens a single Pull Request. You use **orchestrator + development** instructions from this repo to decide how to tackle the task and then implement it.

## Step 0 — Load agent instructions

Before doing anything else:

1. **Read** `.github/agents/jira-task-orchestrator.agent.md` — it defines the pipeline: classify → plan (if needed) → implement → quality → PR.
2. **Read** `.github/agents/development.agent.md` — implementation rules and repo context.
3. **Read** `.github/agents/quality.agent.md` — how to run lint/test/build and report the result.

Then follow the orchestrator: classify → (optional plan) → implement per Development → run Quality per quality.agent.md → create one PR.

## Task context

- **Jira key:** ${{ github.event.inputs.jira_key }}
- **Title:** ${{ github.event.inputs.title }}
- **Description / Scope / Acceptance criteria:**

```
${{ github.event.inputs.description }}
```

## Your run

**CRITICAL — Jira comments per phase:** You MUST call the Jira MCP tool **add_comment** (with the jira_key from inputs) **immediately after each** of steps 1–4, **before** moving to the next step. Do not batch all comments at the end. The ticket must show 4–5 separate comments (Classify, optional Plan, Development, Quality, PR). If you skip a comment, the run is incomplete.

1. **Classify** — Decide: simple feature / bug fix / unclear scope / docs-only.  
   → **Right away:** Call **add_comment** for this issue (jira_key = ${{ github.event.inputs.jira_key }}): `[Orchestrator — Classify]` + classification result. **Do not proceed to step 2 or 3 until this comment is posted.**

2. **Plan (if needed)** — If scope is vague, write 2–3 sentences of what you will deliver and where.  
   → **Right away:** Call **add_comment**: `[Orchestrator — Plan]` + plan summary. **Do not proceed to step 3 until this comment is posted.**

3. **Implement** — Follow Development agent: implement acceptance criteria, fix failures.  
   → **Right away:** Call **add_comment**: `[Orchestrator — Development]` + what was implemented (files, summary). **Do not proceed to step 4 until this comment is posted.**

4. **Quality** — Run lint, test, build (existing scripts); summarize pass/fail.  
   → **Right away:** Call **add_comment**: `[Orchestrator — Quality]` + result (e.g. "Lint: pass. Test: pass. Build: pass."). **Do not proceed to step 5 until this comment is posted.**

5. **Create PR** — Use the create-pull-request safe output:
   - Branch: e.g. `jira/${{ github.event.inputs.jira_key }}-add-header`.
   - Title: `[jira] ${{ github.event.inputs.jira_key }}: <short title from task>`.
   - Body: full task description + list of changes + optional "Pipeline state" (Classify → Plan if any → Development → Quality → PR). Include Jira link if you have the base URL.

6. **Final Jira update via MCP** — Use the **Jira MCP server**:
   - **add_comment** — `[Orchestrator — PR]` Pull request created: [title](link). Moving to Code Review.
   - **transition_issue** — Move the issue to "Code Review" (transition id `2` if the tool requires it).
     If Jira MCP fails, note it in the PR description; a separate workflow may still post to Jira as fallback.

7. If the task cannot be done (blocker, missing info), explain in the PR description and still open the PR (fallback-as-issue may apply). Optionally post a Jira comment that the task could not be completed and why.

## Constraints

- Do not modify `.github/` workflows or `.github/agents/` unless the task explicitly requires it.
- One logical change per run; one PR per run.
- Prefer existing patterns and tooling in the repo.

## Usage

- **From Jira (recommended):** Use Jira Automation so that when an issue is assigned to your bot, call GitHub API to trigger this workflow with inputs:
  - **Endpoint:** `POST https://api.github.com/repos/OWNER/REPO/actions/workflows/jira-to-pr.lock.yml/dispatches`
  - **Headers:** `Authorization: token YOUR_GITHUB_PAT`, `Accept: application/vnd.github.v3+json`
  - **Body (JSON):** `{"ref": "main", "inputs": {"jira_key": "{{issue.key}}", "title": "{{issue.fields.summary}}", "description": "{{issue.fields.description}}"}}`
  - Use a GitHub PAT with `workflow` scope. Replace OWNER/REPO with your org and repo.
- **Manual run:** Actions → "Jira → Pull Request (Tech Debt Agent)" → Run workflow, then fill Jira key, title, and description.
- **CLI:** `gh workflow run "jira-to-pr.lock.yml" -f jira_key=BUY-505 -f title="Add tests" -f description="Add unit tests for checkout"`  
  Or: `gh aw run jira-to-pr` (if your gh-aw version supports passing inputs).

**Engine:** Uses `engine: codex` (GitHub Copilot). For Claude instead, set `engine: claude` and **ANTHROPIC_API_KEY** secret (Anthropic account must have credits).

**Jira MCP:** The agent posts a comment and transitions the ticket via the Jira MCP server (`add_comment`, `transition_issue`). Ensure repo secrets `JIRA_EMAIL` and `JIRA_API_TOKEN` are set (same as for `notify-jira-on-pr`). If you want only MCP (no duplicate), you can disable the "Notify Jira on PR" workflow or remove the comment/transition steps from it.
