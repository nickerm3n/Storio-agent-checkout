# Jira PoC: example tasks and workflow ideas

Example Jira task descriptions for testing the Jira → PR agentic flow, plus ideas for other gh-aw PoC workflows.

---

## 0. Verify Jira API and MCP access

### Test Jira MCP (agent calls the tool)

Use the **"Test Jira MCP"** agentic workflow to verify that the Jira MCP server starts and the agent can call it:

1. Compile once: `gh aw compile test-jira-mcp` and commit `test-jira-mcp.lock.yml`.
2. Actions → **Test Jira MCP** (or the name of the compiled workflow) → Run workflow.
3. Enter a Jira issue key (e.g. `DEV-1`).
4. Run.

- **Success:** The agent calls `mcp__atlassian__jira_add_comment`, and a comment `[MCP test] Jira MCP add_comment succeeded.` appears on the issue. So MCP is available and auth works.
- **"Jira MCP is not available"** in the agent log: The Atlassian MCP server did not register. Check "Start MCP Gateway" step and MCP logs.

**Note:** The workflow uses the **mcp/atlassian** Docker image (not the npx-based OrenGrinker server), so no "npm could not determine executable" errors. Tools: `mcp__atlassian__jira_add_comment`, `mcp__atlassian__jira_transition_issue`.
- **Tool call error** (e.g. 401, 403): Credentials or permissions; fix `JIRA_EMAIL` / `JIRA_API_TOKEN` or project permissions.

### Test credentials and network (without MCP)

Use the **"Test Jira API"** workflow (plain curl, no agent):

1. Actions → **Test Jira API** → Run workflow.
2. Enter a Jira issue key (e.g. `DEV-1`).
3. Run.

- **Success:** You get HTTP 200 on `/rest/api/2/myself` and HTTP 201 on posting a comment. A test comment appears in the issue. Then `JIRA_EMAIL` and `JIRA_API_TOKEN` are valid and reachable from GitHub.
- **401 Unauthorized:** Wrong email, wrong token, or token expired. Create a new [Atlassian API token](https://id.atlassian.com/manage-profile/security/api-tokens) and update the repo secret `JIRA_API_TOKEN`.
- **404 / 403:** Wrong issue key, or the user has no permission to comment on that project. Use a key from a project where the Jira user has "Add comments" permission.
- **Timeout / connection refused:** Network or firewall; from GitHub’s side the `network.allowed` in the agentic workflow already includes `*.atlassian.net`.

### "Jira MCP is not available in the current tool environment"

If the agent reports that Jira MCP (`add_comment` / `transition_issue`) is **not available**, the Jira MCP server did not register with the MCP gateway — so the tools never appear in the agent’s tool list.

**What to check:**

1. **Start MCP Gateway step**  
   In the same run, open the step **"Start MCP Gateway"**. In its log, look for lines about `jira` or errors (e.g. "failed to start", "timeout", "ECONNREFUSED"). The gateway starts each MCP server (GitHub, Jira, safeoutputs); if the Jira server fails to start, its tools are never advertised.

2. **MCP logs artifact**  
   After the run, download the **agent-artifacts** artifact. It includes `mcp-logs/`. Open any logs that mention `jira` or the Jira server and check for startup or runtime errors.

3. **Network and lock file**  
   The workflow must allow access to Jira:
   - In `jira-to-pr.md` frontmatter you should have `network.allowed` including `*.atlassian.net`.
   - Run `gh aw compile jira-to-pr`, commit and push `jira-to-pr.lock.yml` so the run uses the version that has this network config. Without it, the Jira MCP container may not reach Jira API.

4. **First run: image and npm**  
   The Jira server runs in a container (`node:lts-alpine`) and runs `npx -y @orengrinker/jira-mcp-server`. The first run may need to pull the image and the npm package; if the step has a short timeout, it can fail. Retrying the run sometimes helps.

5. **Secrets for the gateway**  
   The "Start MCP Gateway" step receives `JIRA_EMAIL` and `JIRA_API_TOKEN` from repo secrets; they are passed into the MCP config. If either secret is missing or empty, the Jira server may fail or refuse to start. Verify both are set in Settings → Secrets and variables → Actions.

### Check if the agent is calling Jira MCP

When the **Jira → PR** agentic workflow runs:

1. Open the run → job **agent** (or the step that runs Claude/Codex).
2. In the step log, search for:
   - `mcp__jira__add_comment` or `add_comment` — the model requesting the Jira tool.
   - `"error"` or `"billing_error"` or HTTP codes — MCP or API errors.
3. If the agent says **"Jira MCP is not available"**, the tools were never in its list — follow the "Jira MCP is not available" section above. If you see `add_comment` calls but then an error, the problem is MCP/Jira (auth or network).

### Local check of Jira credentials (optional)

```bash
export JIRA_EMAIL="your@email"
export JIRA_API_TOKEN="your-token"
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "https://agent-ai-poc.atlassian.net/rest/api/2/myself"
```

If this returns your user JSON, the credentials work. Use the same values in the repo secrets.

---

## 1. Task: Make a header (passes validation)

Use this in Jira when you want the agent to add a header to the main page. Description is valid (≥200 chars, has ## Scope and ## Acceptance Criteria).

**Title:** Add header to main page

**Description:**

```markdown
## Scope

Add a simple header component to the main page of the app. The header should show the app/product name and optionally a minimal nav (e.g. Home, Settings). Reuse existing styling (e.g. Tailwind or project CSS). Do not change routing or add new pages; only add the header to the current main page.

## Acceptance Criteria

- A header component exists and is rendered at the top of the main page.
- The header displays the application name (or a configurable title).
- Optional: one or two placeholder links (e.g. Home, Settings) that do not need to navigate yet.
- Layout is responsive; the header does not break on narrow viewports.
- No modification of existing app logic beyond mounting the header; only new components and the minimal wiring to show them on the main page.
```

---

## 2. Task: Fails validation (for testing Jira Automation “else” branch)

Use this to verify that when the description does **not** meet the rules (too short or missing sections), the rule goes to the **Else** branch (comment + unassign), and does **not** trigger GitHub.

**Title:** Fix footer

**Description (too short, no ## Scope / ## Acceptance Criteria):**

```text
Add a footer with copyright.
```

Or use a description that has the sections but is under 200 characters:

```markdown
## Scope

Add footer.

## Acceptance Criteria

Add footer with copyright.
```

---

## 3. Task: Another valid task (e.g. dependency check)

Use this to test a second type of work: the agent runs a dependency audit and opens a PR with updates or an issue with findings.

**Title:** Audit dependencies and report outdated packages

**Description:**

```markdown
## Scope

Run a dependency audit for the frontend app (npm/pnpm/yarn). Identify outdated or vulnerable packages and produce a short report. Prefer using the project's existing package manager and scripts; if none exist, use `npm outdated` or equivalent. Do not change application source code; only add or run tooling and produce the report.

## Acceptance Criteria

- A script or one-off command is documented or added (e.g. in package.json or a CONTRIBUTING section) that runs the dependency audit.
- The output lists outdated major/minor/patch versions for production (and optionally dev) dependencies.
- If high/critical vulnerabilities are found, they are clearly called out in the report.
- Result is captured in a comment, an issue, or a markdown file in the repo (e.g. docs/dependency-audit-YYYY-MM-DD.md). No changes to existing app code; only tooling and report artifacts.
```

---

## 4. PoC workflow ideas (gh-aw)

Based on [Agentic Authoring](https://github.github.com/gh-aw/guides/agentic-authoring/) and common gh-aw patterns, you can add these as **separate agentic workflows** (new `.md` in `.github/workflows/`) to test different triggers and use cases:

| Idea                                 | Trigger                                   | What the agent does                                                                                              | Safe output                                                                                    |
| ------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Dependency / security check**      | `schedule: weekly` or `workflow_dispatch` | Runs `npm audit` / `npm outdated`, checks for known vulnerabilities, summarizes.                                 | `add-comment` on a dedicated “Dependency Report” issue, or `create-issue` with the report.     |
| **Label / triage** (IssueOps)        | `issues: types: [opened]`                 | Reads new issue body and title, suggests labels (e.g. bug, enhancement, docs) and optionally assigns.            | `add-comment` with suggested labels; or use external label APIs via safe outputs if available. |
| **PR summary**                       | `pull_request: types: [opened]`           | Summarizes PR diff and description, posts a short summary as a comment.                                          | `add-comment` on the PR.                                                                       |
| **Daily / weekly digest** (DailyOps) | `schedule: daily`                         | Lists recent issues/PRs, open items, and optionally dependency or build status; posts to an issue or discussion. | `create-issue` or `add-comment`.                                                               |
| **“Header / footer / tests” tasks**  | `workflow_dispatch` (from Jira)           | Current jira-to-pr: implement a small, well-scoped task from Jira (e.g. add header, add tests) and open a PR.    | `create-pull-request`.                                                                         |

For a **dependency-check** PoC workflow you could:

- **Trigger:** `workflow_dispatch` + optional `schedule: weekly`.
- **Steps (in the .md prompt):** Run `npm audit --json` and/or `npm outdated`, parse output, write a short markdown report (outdated list, vulnerabilities if any).
- **Safe output:** `create-issue` with title like `[Dependency Report] YYYY-MM-DD` and body = report, or `add-comment` on a pinned “Dependency Report” issue.

A ready-to-use workflow is in **`.github/workflows/dependency-report.md`**. After editing, compile it:

```bash
gh aw compile dependency-report
```

Commit the generated `dependency-report.lock.yml` (and keep it in `.gitattributes` as `linguist-generated=true merge=ours` if you use that).
