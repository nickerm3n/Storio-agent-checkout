import React from "react"

const defaultAppName = "Checkout Agent Sandbox"

export function AppHeader() {
  const appName = import.meta.env.VITE_APP_NAME || defaultAppName

  return (
    <header className="app-header" aria-label="Main navigation">
      <a className="app-name" href="#">
        {appName}
      </a>

      <nav>
        <ul className="app-nav">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
