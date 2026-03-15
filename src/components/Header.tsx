import React from "react"

const APP_TITLE: string = import.meta.env.VITE_APP_TITLE ?? "Storio Agent"

export function Header() {
  return (
    <header className="site-header">
      <span className="site-header-title">{APP_TITLE}</span>
      <nav className="site-header-nav">
        <a href="#" className="site-header-nav-link">Home</a>
        <a href="#" className="site-header-nav-link">Settings</a>
      </nav>
    </header>
  )
}
