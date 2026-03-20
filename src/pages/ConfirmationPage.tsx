import React from "react"
import type { OrderPayload } from "../types/checkout"
import type { VendorConfig } from "../types/vendor"
import { OrderSummary } from "../components/OrderSummary"

interface ConfirmationPageProps {
  vendor: VendorConfig
  order: OrderPayload
}

export function ConfirmationPage({ vendor, order }: ConfirmationPageProps) {
  return (
    <section data-test="DEV-9-confirmation-page" className="card">
      <h2>Order confirmed ✓</h2>
      <p>Your order has been placed. The following details were sent to the backend:</p>

      <OrderSummary vendor={vendor} address={order.address} />

      {/* Debug panel: shows serialised payload so QA can verify county is included */}
      <details className="debug-payload">
        <summary>Order payload (debug)</summary>
        <pre data-test="DEV-9-order-payload">{JSON.stringify(order, null, 2)}</pre>
      </details>
    </section>
  )
}
