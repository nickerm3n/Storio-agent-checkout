import React from "react"
import type { Address } from "../types/checkout"
import type { VendorConfig } from "../types/vendor"

interface OrderSummaryProps {
  vendor: VendorConfig
  address: Address
}

export function OrderSummary({ vendor, address }: OrderSummaryProps) {
  return (
    <div data-test="DEV-9-order-summary" className="order-summary">
      <h3>Delivery address</h3>
      <p>
        {address.firstName} {address.lastName}
      </p>
      <p>{address.street}</p>
      <p>
        {address.postalCode} {address.city}
      </p>
      {/* County is shown when present — fixes the display regression for HF ES/PT and PBX IT */}
      {address.county && (
        <p data-test="DEV-9-county-summary">
          {vendor.countyLabel ?? "County"}: {address.county}
        </p>
      )}
      <p>{address.country}</p>
    </div>
  )
}
