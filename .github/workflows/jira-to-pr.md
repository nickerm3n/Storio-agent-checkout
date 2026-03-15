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

The **orchestrator must leave a comment in the Jira ticket after each phase** (via Jira MCP `add_comment`), so the ticket shows what each phase did.

1. **Classify** — Using the orchestrator, decide: simple feature / bug fix / unclear scope / docs-only.  
   → **Comment in Jira:** `[Orchestrator — Classify]` + classification result (e.g. "Task classified as: Simple feature. Proceeding to implementation.").

2. **Plan (if needed)** — If scope is vague or missing criteria, write 2–3 sentences of what you will deliver and where in the repo.  
   → **Comment in Jira:** `[Orchestrator — Plan]` + short plan summary.

3. **Implement** — Follow Development agent: locate code, implement acceptance criteria, fix failures.  
   → **Comment in Jira:** `[Orchestrator — Development]` + what was implemented (files, acceptance criteria covered).

4. **Quality** — Follow Quality agent: run lint, test, build (existing scripts); summarize pass/fail.  
   → **Comment in Jira:** `[Orchestrator — Quality]` + result (e.g. "Lint: pass. Test: pass. Build: pass. Quality gate: passed.").

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

**Engine:** This workflow uses `engine: claude`. Set the **ANTHROPIC_API_KEY** secret in the repo (Settings → Secrets → Actions) so the agent can call Claude.

**Jira MCP:** The agent posts a comment and transitions the ticket via the Jira MCP server (`add_comment`, `transition_issue`). Ensure repo secrets `JIRA_EMAIL` and `JIRA_API_TOKEN` are set (same as for `notify-jira-on-pr`). If you want only MCP (no duplicate), you can disable the "Notify Jira on PR" workflow or remove the comment/transition steps from it.
