import React from "react"

const APP_TITLE = "Checkout Agent"

export function AppHeader() {
  return (
    <nav className="app-header" data-test="DEV-7-header">
      <div className="app-header-inner">
        <span className="app-header-title">{APP_TITLE}</span>
        <ul className="app-header-nav">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
