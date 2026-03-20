import React from "react"

const APP_NAME = import.meta.env.VITE_APP_NAME ?? "Storio"

export function Header() {
  return (
    <nav className="app-header" data-test="DEV-7-header">
      <span className="app-header__title">{APP_NAME}</span>
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
  )
}
