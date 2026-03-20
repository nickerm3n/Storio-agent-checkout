import React from "react"
import { OrderSummary } from "../components/OrderSummary"
import type { Address } from "../types/checkout"
import type { VendorConfig } from "../types/vendor"

interface PaymentPageProps {
  vendor: VendorConfig
  address: Address
  onBack: () => void
  onPlaceOrder: () => void
}

export function PaymentPage({ vendor, address, onBack, onPlaceOrder }: PaymentPageProps) {
  return (
    <section data-test="DEV-9-payment-page" className="card">
      <h2>Payment</h2>

      {/* Address summary — county must be visible here after navigating back from this page */}
      <OrderSummary vendor={vendor} address={address} />

      <div className="payment-placeholder">
        <p>Payment fields would appear here.</p>
      </div>

      <div className="button-row">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Back to details
        </button>
        <button
          type="button"
          data-test="DEV-9-place-order"
          className="btn-primary"
          onClick={onPlaceOrder}
        >
          Place order
        </button>
      </div>
    </section>
  )
}
