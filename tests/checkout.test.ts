import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  createCheckoutSummary,
  formatUsd,
  togglePromoCode,
  type CheckoutItem
} from "../src/pages/checkout-model.ts"

const ITEMS: CheckoutItem[] = [
  {
    id: "starter-plan",
    name: "Starter Plan",
    unitPriceCents: 4900,
    quantity: 1
  },
  {
    id: "priority-support",
    name: "Priority Support",
    unitPriceCents: 1500,
    quantity: 1
  }
]

test("createCheckoutSummary computes subtotal, discount and total with promo code", () => {
  const summary = createCheckoutSummary(ITEMS, "save10")

  assert.equal(summary.subtotalCents, 6400)
  assert.equal(summary.discountCents, 640)
  assert.equal(summary.totalCents, 5760)
  assert.equal(summary.promoCode, "SAVE10")
})

test("togglePromoCode alternates between active and inactive states", () => {
  const firstToggle = togglePromoCode(null)
  const secondToggle = togglePromoCode(firstToggle)

  assert.equal(firstToggle, "SAVE10")
  assert.equal(secondToggle, null)
})

test("formatUsd outputs US currency", () => {
  assert.equal(formatUsd(5760), "$57.60")
})

test("checkout page includes summary fields and promo action", async () => {
  const thisDir = path.dirname(fileURLToPath(import.meta.url))
  const appPath = path.resolve(thisDir, "../src/pages/app.tsx")
  const appSource = await fs.readFile(appPath, "utf8")

  assert.match(appSource, /Checkout summary/)
  assert.match(appSource, /Subtotal/)
  assert.match(appSource, /Discount/)
  assert.match(appSource, /Total/)
  assert.match(appSource, /Apply SAVE10 promo/)
})
