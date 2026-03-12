import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const appFilePath = path.resolve(process.cwd(), "src/pages/app.tsx")
const appSource = fs.readFileSync(appFilePath, "utf8")

test("checkout page renders expected top-level sections", () => {
  assert.match(appSource, /<header className="page-header">/)
  assert.match(appSource, /<main className="page-main">/)
  const cardSections = appSource.match(/<section className="card">/g) ?? []
  assert.ok(cardSections.length >= 2)
})

test("checkout page includes current status and technical detail content", () => {
  assert.match(appSource, /<h2>Current status<\/h2>/)
  assert.match(appSource, /<h2>Technical details<\/h2>/)
  assert.match(appSource, /Next steps: plug in agent actions/)
})

test("technical details list keeps expected baseline items", () => {
  assert.match(appSource, /<li>React 18 \+ TypeScript<\/li>/)
  assert.match(appSource, /<li>Vite as the build tool<\/li>/)
  assert.match(appSource, /<li>Ready to move into a separate repository<\/li>/)
})
