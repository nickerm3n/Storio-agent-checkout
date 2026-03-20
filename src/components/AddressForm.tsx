import React from "react"
import type { Address } from "../types/checkout"
import type { VendorConfig } from "../types/vendor"

interface AddressFormProps {
  vendor: VendorConfig
  address: Address
  onChange: (patch: Partial<Address>) => void
  onSubmit: () => void
}

export function AddressForm({ vendor, address, onChange, onSubmit }: AddressFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form
      data-test="DEV-9-address-form"
      className="address-form"
      onSubmit={handleSubmit}
    >
      <div className="form-row">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          value={address.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          value={address.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="street">Street</label>
        <input
          id="street"
          value={address.street}
          onChange={(e) => onChange({ street: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="city">City</label>
        <input
          id="city"
          value={address.city}
          onChange={(e) => onChange({ city: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="postalCode">Postal code</label>
        <input
          id="postalCode"
          value={address.postalCode}
          onChange={(e) => onChange({ postalCode: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="country">Country</label>
        <input
          id="country"
          value={address.country}
          onChange={(e) => onChange({ country: e.target.value })}
          required
        />
      </div>

      {vendor.hasCounty && (
        <div className="form-row" data-test="DEV-9-county-field">
          <label htmlFor="county">
            {vendor.countyLabel ?? "County / Region"}{" "}
            <span className="optional">(optional)</span>
          </label>
          <input
            id="county"
            value={address.county ?? ""}
            onChange={(e) => onChange({ county: e.target.value })}
          />
        </div>
      )}

      <button type="submit" className="btn-primary">
        Continue to payment
      </button>
    </form>
  )
}
