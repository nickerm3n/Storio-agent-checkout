import test from "node:test"
import assert from "node:assert/strict"
import {
  checkoutPageContent,
  getCheckoutCard
} from "../src/pages/checkout-content.mjs"

test("checkout page exposes the expected main heading and subtitle", () => {
  assert.equal(checkoutPageContent.title, "Checkout Agent Sandbox")
  assert.match(
    checkoutPageContent.subtitle,
    /Minimal React \+ Vite app for experimenting with agentic workflows\./
  )
})

test("current status card exists and includes workflow copy", () => {
  const statusCard = getCheckoutCard("Current status")

  assert.ok(statusCard)
  assert.equal(statusCard.heading, "Current status")
  assert.match(statusCard.description, /Single-page view without routing\./)
})

test("technical details card includes all listed technologies", () => {
  const detailsCard = getCheckoutCard("Technical details")

  assert.ok(detailsCard)
  assert.deepEqual(detailsCard.items, [
    "React 18 + TypeScript",
    "Vite as the build tool",
    "Ready to move into a separate repository"
  ])
})

test("getCheckoutCard returns undefined for unknown headings", () => {
  assert.equal(getCheckoutCard("Not a real card"), undefined)
})
