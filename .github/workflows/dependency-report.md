---
description: "Agentic workflow: run dependency audit daily, post report as issue and optionally open a PR with updates."
on:
  workflow_dispatch: {}
  schedule:
    - cron: "0 9 * * *"

permissions:
  contents: read

safe-outputs:
  create-issue:
    title-prefix: "[Dependency Report] "
    labels: [automation, dependencies]
    max: 1
  create-pull-request:
    title-prefix: "[deps] "
    labels: [automation, dependencies]
    draft: true
    max: 1
    if-no-changes: ignore
    protected-files: allowed

engine: claude
---

# Dependency Report (PoC)

You are an AI agent. When this workflow runs, you must:
1. Produce a **dependency audit report** and publish it as a **GitHub Issue**.
2. If there are safe dependency updates (patch/minor or auto-fixable audit), open a **Pull Request** with those updates.

## Your goal

1. **Detect package manager:** Determine how this repo manages dependencies (npm, pnpm, yarn) from lockfiles and scripts.
2. **Run audit:** `npm outdated`, `npm audit` (or pnpm/yarn equivalents). Build a markdown report.
3. **Create one Issue** with the report (always), using the create-issue safe output.
4. **Optionally create one PR:** If there are patch/minor updates or `npm audit fix`-able vulnerabilities, apply updates only to dependency files (package.json, lockfile), then use the create-pull-request safe output. If nothing to update or only major/breaking changes, skip the PR.

## Report structure (issue body)

Use this structure for the issue:

```markdown
## Dependency report — ${{ github.run_id }}

**Package manager:** (npm | pnpm | yarn)
**Branch:** ${{ github.event.repository.default_branch }}

### Outdated packages
(List or table: name, current, wanted, latest)

### Vulnerabilities (if any)
(Count by severity; list high/critical)

### PR opened?
(Yes — a PR was created by this run; see Actions run for link. | No — no safe updates / only major / audit not auto-fixable.)

### Notes
(Errors or "No issues found.")
```

## Instructions

1. **Inspect repo:** Find `package.json` and lockfile in repo root (or monorepo roots).
2. **Read-only audit:** Run `npm outdated`, `npm audit` (or equivalent). Fill the report template.
3. **Create the issue** via create-issue with title `[Dependency Report] YYYY-MM-DD` and body = report (you can fill "PR opened?" after the next step).
4. **Decide on PR:**
   - If there are patch/minor updates or vulnerabilities fixable with `npm audit fix`, run the update commands (e.g. `npm update`, `npm audit fix`). Commit only dependency files (package.json, package-lock.json, etc.).
   - Create a PR via create-pull-request: branch e.g. `deps/daily-YYYY-MM-DD`, title `[deps] Daily dependency update YYYY-MM-DD`, body = short summary + link to the report issue.
   - If no safe updates or only major bumps, do not create a PR. In the issue body you already used "PR opened? No — ...".

## Constraints

- Do not change application source code; only dependency manifests and lockfiles.
- One issue per run; at most one PR per run (and only when there are safe changes).
- Prefer patch/minor updates; do not bump major versions automatically unless the task explicitly allows it.

## How it runs

- **Once a day:** Schedule runs at 09:00 UTC every day (`cron: "0 9 * * *"`).
- **Manual:** Actions → "Dependency Report (PoC)" → Run workflow.
