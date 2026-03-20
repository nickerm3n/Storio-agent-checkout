import React from "react"

const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "Storio"

export function AppHeader() {
  return (
    <header className="app-header" data-test="DEV-9-header">
      <span className="app-header__title">{APP_TITLE}</span>
      <nav className="app-header__nav" aria-label="Main navigation">
        <a href="#" className="app-header__nav-link">Home</a>
        <a href="#" className="app-header__nav-link">Settings</a>
      </nav>
    </header>
  )
}
