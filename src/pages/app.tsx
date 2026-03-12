import React from "react"
import {
  applyPromo,
  calculateSubtotal,
  decreaseQuantity,
  formatCurrency,
  increaseQuantity,
  placeOrder
} from "../services/checkout"

export function App() {
  const [quantity, setQuantity] = React.useState(1)
  const [email, setEmail] = React.useState("shopper@example.com")
  const [promoCode, setPromoCode] = React.useState("")
  const [statusMessage, setStatusMessage] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const unitPriceCents = 2599
  const subtotalCents = calculateSubtotal([{ priceCents: unitPriceCents, quantity }])
  const totalCents = applyPromo(subtotalCents, promoCode)

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatusMessage("")

    try {
      const result = await placeOrder({
        email,
        promoCode: promoCode.trim() || undefined,
        items: [{ sku: "story-book", quantity, priceCents: unitPriceCents }]
      })
      setStatusMessage(`Order ${result.orderId} placed successfully.`)
    } catch (error) {
      setStatusMessage("Checkout failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <span className="badge">PoC</span>
        <h1>Checkout Agent Sandbox</h1>
        <p className="subtitle">
          Minimal React + Vite app for experimenting with agentic workflows.
        </p>
      </header>

      <main className="page-main">
        <section className="card" aria-label="Checkout page">
          <h2>Checkout</h2>
          <form onSubmit={handleCheckout}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor="promo">Promo code</label>
            <input
              id="promo"
              name="promo"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="SAVE10"
            />

            <div className="quantity">
              <span>Quantity</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => decreaseQuantity(current))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <strong aria-label="Quantity value">{quantity}</strong>
              <button
                type="button"
                onClick={() => setQuantity((current) => increaseQuantity(current))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p aria-label="Order total">Total: {formatCurrency(totalCents)}</p>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place order"}
            </button>
          </form>
          {statusMessage ? <p role="status">{statusMessage}</p> : null}
        </section>
      </main>
    </div>
  )
}
