import React from "react"

const APP_TITLE = (import.meta as { env?: { VITE_APP_TITLE?: string } }).env?.VITE_APP_TITLE ?? "Storio"

export function Header() {
  return (
    <nav className="app-nav" data-test="DEV-7-header">
      <span className="app-nav__brand">{APP_TITLE}</span>
      <ul className="app-nav__links">
        <li><a href="#" className="app-nav__link">Home</a></li>
        <li><a href="#" className="app-nav__link">Settings</a></li>
      </ul>
    </nav>
  )
}
