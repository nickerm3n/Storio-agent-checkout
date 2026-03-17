import React from "react"

const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "Checkout Agent Sandbox"

export function Header() {
  return (
    <header className="site-header" data-test="DEV-7-header">
      <span className="site-header__title">{APP_TITLE}</span>
      <nav className="site-header__nav" aria-label="Main navigation">
        <a className="site-header__link" href="#">
          Home
        </a>
        <a className="site-header__link" href="#">
          Settings
        </a>
      </nav>
    </header>
  )
}
