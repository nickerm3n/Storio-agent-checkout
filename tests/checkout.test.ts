// @ts-nocheck
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import { describe, it } from "node:test"
import {
  applyPromo,
  calculateSubtotal,
  decreaseQuantity,
  increaseQuantity,
  placeOrder
} from "../src/services/checkout.ts"

describe("checkout flow", () => {
  it("contains checkout page component structure", async () => {
    const componentSource = await fs.readFile("./src/pages/app.tsx", "utf8")

    assert.match(componentSource, /<h2>Checkout<\/h2>/)
    assert.match(componentSource, /<form onSubmit={handleCheckout}>/)
    assert.match(componentSource, /aria-label="Increase quantity"/)
    assert.match(componentSource, /"Place order"/)
  })

  it("handles quantity interaction rules", () => {
    assert.equal(decreaseQuantity(1), 1)
    assert.equal(decreaseQuantity(3), 2)
    assert.equal(increaseQuantity(2), 3)
  })

  it("applies promo and computes totals", () => {
    const subtotal = calculateSubtotal([{ sku: "story-book", quantity: 2, priceCents: 2599 }])
    const totalWithoutPromo = applyPromo(subtotal)
    const totalWithPromo = applyPromo(subtotal, "SAVE10")

    assert.equal(subtotal, 5198)
    assert.equal(totalWithoutPromo, 5198)
    assert.equal(totalWithPromo, 4678)
  })

  it("integrates with checkout service to place an order", async () => {
    const result = await placeOrder({
      email: "shopper@example.com",
      promoCode: "SAVE10",
      items: [{ sku: "story-book", quantity: 2, priceCents: 2599 }]
    })

    assert.match(result.orderId, /^demo-\d+$/)
    assert.equal(result.totalCents, 4678)
  })
})
