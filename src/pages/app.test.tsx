import { render, screen } from "@testing-library/react"
import { beforeEach, describe, it, expect } from "vitest"
import { App } from "./app"

describe("App", () => {
  beforeEach(() => {
    render(<App />)
  })

  it("renders the PoC badge", () => {
    expect(screen.getByText("PoC")).toBeInTheDocument()
  })

  it("renders the main heading", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: "Checkout Agent Sandbox" })
    ).toBeInTheDocument()
  })

  it("renders the subtitle", () => {
    expect(
      screen.getByText(
        "Minimal React + Vite app for experimenting with agentic workflows."
      )
    ).toBeInTheDocument()
  })

  it("renders the Current status section heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: "Current status" })
    ).toBeInTheDocument()
  })

  it("renders the Current status description", () => {
    expect(
      screen.getByText(
        /Single-page view without routing\. Next steps: plug in agent actions/
      )
    ).toBeInTheDocument()
  })

  it("renders the Technical details section heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: "Technical details" })
    ).toBeInTheDocument()
  })

  it("renders all technical detail list items", () => {
    expect(screen.getByText("React 18 + TypeScript")).toBeInTheDocument()
    expect(screen.getByText("Vite as the build tool")).toBeInTheDocument()
    expect(
      screen.getByText("Ready to move into a separate repository")
    ).toBeInTheDocument()
  })

  it("renders the page layout structure with correct CSS classes", () => {
    const page = document.querySelector(".page")
    expect(page).not.toBeNull()
    expect(page!.querySelector(".page-header")).not.toBeNull()
    expect(page!.querySelector(".page-main")).not.toBeNull()
  })

  it("renders exactly two card sections", () => {
    const cards = document.querySelectorAll(".card")
    expect(cards).toHaveLength(2)
  })
})
