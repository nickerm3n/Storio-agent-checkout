import React, { ReactElement } from "react"
import { render as rtlRender, RenderOptions } from "@testing-library/react"

function Providers({ children }: { children: React.ReactNode }) {
  return <React.StrictMode>{children}</React.StrictMode>
}

export function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return rtlRender(ui, { wrapper: Providers, ...options })
}

export * from "@testing-library/react"
