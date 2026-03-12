import React, { useMemo, useState } from "react"
import {
  createCheckoutSummary,
  formatUsd,
  togglePromoCode,
  type CheckoutItem
} from "./checkout-model"

const CHECKOUT_ITEMS: CheckoutItem[] = [
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

export function App() {
  const [promoCode, setPromoCode] = useState<string | null>(null)

  const summary = useMemo(() => {
    return createCheckoutSummary(CHECKOUT_ITEMS, promoCode)
  }, [promoCode])

  function handlePromoToggle() {
    setPromoCode((currentCode) => togglePromoCode(currentCode))
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
        <section className="card">
          <h2>Checkout summary</h2>
          <ul className="list">
            {CHECKOUT_ITEMS.map((item) => (
              <li key={item.id}>
                {item.name}: {formatUsd(item.unitPriceCents * item.quantity)}
              </li>
            ))}
            <li>Subtotal: {formatUsd(summary.subtotalCents)}</li>
            <li>Discount: {formatUsd(summary.discountCents)}</li>
            <li>Total: {formatUsd(summary.totalCents)}</li>
          </ul>
          <button onClick={handlePromoToggle}>
            {summary.promoCode ? "Remove promo code" : "Apply SAVE10 promo"}
          </button>
        </section>

        <section className="card">
          <h2>Technical details</h2>
          <ul className="list">
            <li>React 18 + TypeScript</li>
            <li>Vite as the build tool</li>
            <li>Ready to move into a separate repository</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
