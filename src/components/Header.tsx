import React from "react"

const APP_TITLE = (import.meta.env.VITE_APP_TITLE as string | undefined) ?? "Storio Agent"

export function Header() {
  return (
    <header className="site-header">
      <span className="site-header__title">{APP_TITLE}</span>
      <nav className="site-header__nav" aria-label="Main navigation">
        <a href="#" className="site-header__link">Home</a>
        <a href="#" className="site-header__link">Settings</a>
      </nav>
    </header>
  )
}
