const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const appFilePath = path.resolve(__dirname, "../../src/pages/app.tsx")
const appSource = fs.readFileSync(appFilePath, "utf8")

test("includes checkout page headline and subtitle copy", () => {
  assert.match(appSource, /<h1>Checkout Agent Sandbox<\/h1>/)
  assert.match(
    appSource,
    /Minimal React \+ Vite app for experimenting with agentic workflows\./
  )
})

test("includes the expected checkout status and details section headings", () => {
  assert.match(appSource, /<h2>Current status<\/h2>/)
  assert.match(appSource, /<h2>Technical details<\/h2>/)
})

test("includes the expected technical detail list entries", () => {
  assert.match(appSource, /<li>React 18 \+ TypeScript<\/li>/)
  assert.match(appSource, /<li>Vite as the build tool<\/li>/)
  assert.match(appSource, /<li>Ready to move into a separate repository<\/li>/)
})
