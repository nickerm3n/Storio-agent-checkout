import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const checkoutPagePath = new URL("../src/pages/app.tsx", import.meta.url)

async function readCheckoutSource() {
  return readFile(checkoutPagePath, "utf8")
}

test("checkout page exports App component", async () => {
  const source = await readCheckoutSource()

  assert.match(source, /export\s+function\s+App\s*\(/)
})

test("checkout page includes checkout title and status sections", async () => {
  const source = await readCheckoutSource()

  assert.match(source, /Checkout Agent Sandbox/)
  assert.match(source, /Current status/)
  assert.match(source, /Technical details/)
})

test("checkout page technical details list required stack items", async () => {
  const source = await readCheckoutSource()

  assert.match(source, /React 18 \+ TypeScript/)
  assert.match(source, /Vite as the build tool/)
  assert.match(source, /Ready to move into a separate repository/)
})
