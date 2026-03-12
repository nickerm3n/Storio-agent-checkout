import React from "react"
import {
  checkoutFeatureItems,
  checkoutStatusMessage,
  toggleDetailsVisibility
} from "../services/checkout-flow.mjs"

export function App() {
  const [detailsVisible, setDetailsVisible] = React.useState(false)

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
          <h2>Current status</h2>
          <p>
            Single-page view without routing. Next steps: plug in agent actions
            such as reading Jira issues and generating pull requests.
          </p>
          <button
            className="details-toggle"
            type="button"
            onClick={() => setDetailsVisible((value) => toggleDetailsVisibility(value))}
          >
            {detailsVisible ? "Hide checkout details" : "Show checkout details"}
          </button>
          {detailsVisible ? (
            <p className="details-panel">{checkoutStatusMessage}</p>
          ) : null}
        </section>

        <section className="card">
          <h2>Technical details</h2>
          <ul className="list">
            {checkoutFeatureItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
