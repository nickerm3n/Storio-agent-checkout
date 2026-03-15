import React from "react"

const APP_TITLE = String(import.meta.env.VITE_APP_TITLE || "Checkout Agent")

export function AppHeader() {
  return (
    <header className="app-header">
      <span className="app-header__title">{APP_TITLE}</span>
      <nav aria-label="Main navigation">
        <ul className="app-header__nav">
          <li>
            <a href="#" className="app-header__link">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="app-header__link">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
