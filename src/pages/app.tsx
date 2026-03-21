import React, { useState } from "react"
import { AddressForm } from "../components/AddressForm"
import { AddressSummary } from "../components/AddressSummary"
import { VENDORS, getVendor } from "../config/vendors"
import { EMPTY_ADDRESS } from "../types/checkout"
import type { AddressFormState, CheckoutState } from "../types/checkout"

const DEFAULT_VENDOR_ID = "hf-pt"

export function App() {
  const [checkout, setCheckout] = useState<CheckoutState>({
    vendorId: DEFAULT_VENDOR_ID,
    address: { ...EMPTY_ADDRESS },
    page: "details",
  })

  const vendor = getVendor(checkout.vendorId)

  function handleAddressChange(updated: AddressFormState) {
    // County value is kept in shared checkout state so it survives navigation
    // between the Details page and the Payment page (fixes DEV-9).
    setCheckout((prev) => ({ ...prev, address: updated }))
  }

  function handleVendorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCheckout((prev) => ({
      ...prev,
      vendorId: e.target.value,
      address: { ...EMPTY_ADDRESS },
      page: "details",
    }))
  }

  function goTo(page: CheckoutState["page"]) {
    setCheckout((prev) => ({ ...prev, page }))
  }

  return (
    <div className="page">
      <header className="page-header">
        <span className="badge">PoC</span>
        <h1>Checkout Agent Sandbox</h1>
        <p className="subtitle">
          Demonstrates optional county/district/province field persistence across
          checkout page navigation (DEV-9 fix).
        </p>
      </header>

      <main className="page-main">
        {/* Vendor selector — always visible */}
        <section className="card">
          <h2>Vendor</h2>
          <label className="form-field">
            <span>Select vendor</span>
            <select
              value={checkout.vendorId}
              onChange={handleVendorChange}
              data-test="DEV-9-vendor-select"
            >
              {VENDORS.map((v) => (
                <option key={v.vendorId} value={v.vendorId}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          </label>
          <p className="hint">
            {vendor?.countyFieldLabel
              ? `This vendor shows an optional "${vendor.countyFieldLabel}" field.`
              : "This vendor has no county/district field."}
          </p>
        </section>

        {/* Step indicator */}
        <nav className="steps" data-test="DEV-9-steps">
          {(["details", "payment", "summary"] as CheckoutState["page"][]).map(
            (step) => (
              <button
                key={step}
                className={`step-btn${checkout.page === step ? " step-btn--active" : ""}`}
                onClick={() => goTo(step)}
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </button>
            )
          )}
        </nav>

        {/* Details page */}
        {checkout.page === "details" && vendor && (
          <section className="card" data-test="DEV-9-page-details">
            <h2>Details</h2>
            <AddressForm
              vendor={vendor}
              value={checkout.address}
              onChange={handleAddressChange}
            />
            <button
              className="btn-primary"
              onClick={() => goTo("payment")}
              data-test="DEV-9-continue-to-payment"
            >
              Continue to payment →
            </button>
          </section>
        )}

        {/* Payment page — navigating here and back must not clear the county field */}
        {checkout.page === "payment" && (
          <section className="card" data-test="DEV-9-page-payment">
            <h2>Payment</h2>
            <p className="hint">
              (Payment form placeholder — county field value is preserved in
              state while you are on this page.)
            </p>
            <div className="btn-row">
              <button
                className="btn-secondary"
                onClick={() => goTo("details")}
                data-test="DEV-9-back-to-details"
              >
                ← Back to details
              </button>
              <button
                className="btn-primary"
                onClick={() => goTo("summary")}
                data-test="DEV-9-continue-to-summary"
              >
                Review order →
              </button>
            </div>
          </section>
        )}

        {/* Summary page — county value must be shown */}
        {checkout.page === "summary" && vendor && (
          <section className="card" data-test="DEV-9-page-summary">
            <h2>Order summary</h2>
            <AddressSummary
              address={checkout.address}
              countyFieldLabel={vendor.countyFieldLabel}
            />
            <div className="btn-row">
              <button
                className="btn-secondary"
                onClick={() => goTo("details")}
                data-test="DEV-9-back-to-details-from-summary"
              >
                ← Edit address
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
