---
description: "Agentic workflow: Jira ticket assigned to bot → GitHub Agent creates a Pull Request (tech debt / code health). Trigger via Jira Automation (workflow_dispatch API with inputs) or manually from Actions tab."
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

engine: codex
---

# Jira → Pull Request (Tech Debt Agent)

You are an AI coding agent. When this workflow runs, you receive a task that originated from a **Jira ticket** (triggered by assigning the ticket to a bot in Jira, or run manually with the same inputs).

## Your goal

1. **Understand the task** from the title and description below.
2. **Implement the change** in this repository: fix tech debt, improve code health, or fulfill the acceptance criteria. Prefer minimal, focused changes.
3. **Create a single Pull Request** with your changes. Use the safe output to create the PR; do not use raw git push or GitHub API for creating the PR.

## Task context

- **Jira key:** ${{ github.event.inputs.jira_key }}
- **Title:** ${{ github.event.inputs.title }}
- **Description / Acceptance criteria:**

```
${{ github.event.inputs.description }}
```

## Instructions

1. **Analyze** the codebase to find where the task applies (e.g. tests, lint fixes, dependency updates, refactors).
2. **Make the changes** using your edit and bash tools. Run relevant tests or linters if present.
3. **Create a PR** via the create-pull-request safe output:
   - Branch name: use a short slug from the Jira key and title (e.g. `jira/BUY-505-add-tests`).
   - PR title: start with `[jira]` and include the Jira key and short title (e.g. `[jira] BUY-505: Add unit tests for checkout service`).
   - PR body: include the full task description, link to Jira if you have the base URL, and list changes made.
4. If the task cannot be done (e.g. unclear scope, missing context), explain in the PR description what is missing.

## Constraints

- Do not modify protected files (e.g. `.github/` workflows, agent instructions) unless the task explicitly requires it.
- Prefer existing patterns and tooling in the repo (e.g. existing test framework, lint config).
- One logical change per run; one PR per run.

## Usage

- **From Jira (recommended):** Use Jira Automation so that when an issue is assigned to your bot, call GitHub API to trigger this workflow with inputs:
  - **Endpoint:** `POST https://api.github.com/repos/OWNER/REPO/actions/workflows/jira-to-pr.lock.yml/dispatches`
  - **Headers:** `Authorization: token YOUR_GITHUB_PAT`, `Accept: application/vnd.github.v3+json`
  - **Body (JSON):** `{"ref": "main", "inputs": {"jira_key": "{{issue.key}}", "title": "{{issue.fields.summary}}", "description": "{{issue.fields.description}}"}}`
  - Use a GitHub PAT with `workflow` scope. Replace OWNER/REPO with your org and repo.
- **Manual run:** Actions → "Jira → Pull Request (Tech Debt Agent)" → Run workflow, then fill Jira key, title, and description.
- **CLI:** `gh workflow run "jira-to-pr.lock.yml" -f jira_key=BUY-505 -f title="Add tests" -f description="Add unit tests for checkout"`  
  Or: `gh aw run jira-to-pr` (if your gh-aw version supports passing inputs).
