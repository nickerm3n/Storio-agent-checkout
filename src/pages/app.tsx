import React from "react"
import { AppHeader } from "../components/app-header"

export function App() {
  return (
    <div className="page">
      <AppHeader />

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
