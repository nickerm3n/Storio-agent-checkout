import React, { useState } from "react"
import { useCheckout } from "../hooks/useCheckout"
import { getVendorById, VENDORS } from "../data/vendors"
import { DetailsPage } from "./DetailsPage"
import { PaymentPage } from "./PaymentPage"
import { ConfirmationPage } from "./ConfirmationPage"

export function App() {
  const [selectedVendorId, setSelectedVendorId] = useState(VENDORS[0].id)
  const checkout = useCheckout(selectedVendorId, [{ productId: "photo-book-A4", quantity: 1 }])
  const vendor = getVendorById(checkout.state.vendorId) ?? VENDORS[0]

  const [lastOrder, setLastOrder] = React.useState<ReturnType<typeof checkout.submitOrder> | null>(
    null,
  )

  function handlePlaceOrder() {
    const payload = checkout.submitOrder()
    setLastOrder(payload)
  }

  return (
    <div className="page">
      <header className="page-header">
        <span className="badge">PoC</span>
        <h1>Checkout Agent Sandbox</h1>
        <p className="subtitle">
          Vendor address county field fix — DEV-9
        </p>
      </header>

      <main className="page-main">
        {checkout.state.step === "details" && (
          <>
            <section className="card vendor-selector">
              <h2>Select vendor</h2>
              <select
                data-test="DEV-9-vendor-select"
                value={checkout.state.vendorId}
                onChange={(e) => {
                  setSelectedVendorId(e.target.value)
                  checkout.setVendor(e.target.value)
                }}
              >
                {VENDORS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.country}){v.hasCounty ? " — has county field" : ""}
                  </option>
                ))}
              </select>
            </section>

            <DetailsPage
              vendor={vendor}
              address={checkout.state.address}
              onAddressChange={checkout.updateAddress}
              onContinue={checkout.goToPayment}
            />
          </>
        )}

        {checkout.state.step === "payment" && (
          <PaymentPage
            vendor={vendor}
            address={checkout.state.address}
            onBack={checkout.goBackToDetails}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {checkout.state.step === "confirmation" && lastOrder && (
          <ConfirmationPage vendor={vendor} order={lastOrder} />
        )}
      </main>
    </div>
  )
}
