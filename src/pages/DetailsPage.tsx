import React from "react"
import { AddressForm } from "../components/AddressForm"
import type { Address } from "../types/checkout"
import type { VendorConfig } from "../types/vendor"

interface DetailsPageProps {
  vendor: VendorConfig
  address: Address
  onAddressChange: (patch: Partial<Address>) => void
  onContinue: () => void
}

export function DetailsPage({ vendor, address, onAddressChange, onContinue }: DetailsPageProps) {
  return (
    <section data-test="DEV-9-details-page" className="card">
      <h2>Delivery details</h2>
      <p className="vendor-badge">Vendor: {vendor.name}</p>
      <AddressForm
        vendor={vendor}
        address={address}
        onChange={onAddressChange}
        onSubmit={onContinue}
      />
    </section>
  )
}
