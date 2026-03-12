import React from "react"
import { checkoutPageContent, getCheckoutCard } from "./checkout-content.mjs"

export function App() {
  const statusCard = getCheckoutCard("Current status")
  const detailsCard = getCheckoutCard("Technical details")

  if (!statusCard || !detailsCard || !detailsCard.items) {
    throw new Error("Checkout page content is missing required cards")
  }

  return (
    <div className="page">
      <header className="page-header">
        <span className="badge">{checkoutPageContent.badge}</span>
        <h1>{checkoutPageContent.title}</h1>
        <p className="subtitle">{checkoutPageContent.subtitle}</p>
      </header>

      <main className="page-main">
        <section className="card">
          <h2>{statusCard.heading}</h2>
          <p>{statusCard.description}</p>
        </section>

        <section className="card">
          <h2>{detailsCard.heading}</h2>
          <ul className="list">
            {detailsCard.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
