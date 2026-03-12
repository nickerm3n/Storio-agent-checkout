import { describe, expect, it } from "vitest"
import userEvent from "@testing-library/user-event"
import { App } from "../src/pages/app"
import { render, screen } from "./test-utils"

describe("main page", () => {
  it("renders the core page content", () => {
    render(<App />)

    expect(
      screen.getByRole("heading", { name: "Checkout Agent Sandbox", level: 1 })
    ).toBeVisible()
    expect(screen.getByText(/Minimal React \+ Vite app/i)).toBeVisible()
    expect(screen.getByRole("heading", { name: "Current status", level: 2 })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Technical details", level: 2 })).toBeVisible()
    expect(screen.getByText("React 18 + TypeScript")).toBeVisible()
  })

  it("shows and hides additional details when the toggle is clicked", async () => {
    const user = userEvent.setup()
    render(<App />)

    const showButton = screen.getByRole("button", { name: "Show details" })
    expect(screen.queryByText(/tests can run quickly in CI/i)).not.toBeInTheDocument()

    await user.click(showButton)

    expect(screen.getByText(/tests can run quickly in CI/i)).toBeVisible()
    expect(screen.getByRole("button", { name: "Hide details" })).toBeVisible()
  })
})
