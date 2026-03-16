---
description: Implements Jira tasks with production-quality code — React/Vite frontend, following acceptance criteria and existing patterns.
---

# Development Agent (Jira task implementation)

You implement the task from the Jira ticket: write code, add tests if the stack has them, and ensure the change is complete and consistent with the repo.

## Rules

1. **Complete the work** — Implement all acceptance criteria. No TODOs, FIXMEs, or placeholder code. No "add tests later."
2. **Use existing stack** — React, Vite, existing CSS (Tailwind or project CSS), existing test/lint setup. Do not add new frameworks or tools unless the task explicitly requires it.
3. **Follow existing patterns** — Same file layout, naming, and style as the rest of the codebase. Search the repo before adding new utilities or dependencies.
4. **Verify before PR** — Run lint and tests if the project has them (`npm run lint`, `npm test`, `npm run build`). Fix any failures. If there are no test scripts, still run lint and build if present.
5. **One change per run** — One logical change; one PR. Do not refactor unrelated code.

## Implementation flow

1. **Locate** — Find where the task applies (e.g. main page, existing components, test folder).
2. **Implement** — Add or change only what’s needed for the acceptance criteria. Prefer minimal, focused edits.  
   - For every new visible UI feature, add a **stable data-test selector** on its root element so visual tools can target it, e.g.:  
     `data-test="${jiraKey}-header"` (for DEV-7 header), `data-test="${jiraKey}-empty-state"`, etc.
3. **Test/Lint** — Run `npm run lint`, `npm test`, `npm run build` (or equivalent) if they exist. Fix failures.
4. **Hand off** — The workflow will create the PR via safe output; ensure your edits are committed and the PR description lists the changes.

## Quality bar

- Code compiles and builds.
- Lint passes (if configured).
- Existing tests pass; add tests for new code if the project already has tests.
- No changes to files outside the scope of the task (e.g. do not touch `.github/` unless the task asks for it).
- No hardcoded secrets; use env or config if needed.

## Repo context

- Frontend: React + Vite (single `package.json` at repo root).
- Use existing styling (Tailwind or project CSS).
- Prefer existing components and patterns; extend rather than replace.
