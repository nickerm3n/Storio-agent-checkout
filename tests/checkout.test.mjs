import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import {
  checkoutFeatureItems,
  checkoutStatusMessage,
  toggleDetailsVisibility
} from "../src/services/checkout-flow.mjs"

test("checkout service exposes stable technical details", () => {
  assert.equal(Array.isArray(checkoutFeatureItems), true)
  assert.equal(checkoutFeatureItems.length, 3)
  assert.deepEqual(checkoutFeatureItems, [
    "React 18 + TypeScript",
    "Vite as the build tool",
    "Ready to move into a separate repository"
  ])
})

test("checkout details toggling models user interaction state", () => {
  assert.equal(toggleDetailsVisibility(false), true)
  assert.equal(toggleDetailsVisibility(true), false)
})

test("checkout status message is non-empty and references integration testing", () => {
  assert.equal(typeof checkoutStatusMessage, "string")
  assert.notEqual(checkoutStatusMessage.trim(), "")
  assert.match(checkoutStatusMessage, /integration tests/i)
})

test("checkout page integrates with checkout service module", async () => {
  const source = await readFile(new URL("../src/pages/app.tsx", import.meta.url), "utf8")

  assert.match(source, /from "\.\.\/services\/checkout-flow\.mjs"/)
  assert.match(source, /toggleDetailsVisibility\(value\)/)
  assert.match(source, /checkoutFeatureItems\.map\(/)
})
