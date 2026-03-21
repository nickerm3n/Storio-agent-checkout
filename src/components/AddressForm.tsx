import React from "react"
import type { AddressFormState, VendorAddressConfig } from "../types/checkout"

interface AddressFormProps {
  vendor: VendorAddressConfig
  value: AddressFormState
  onChange: (address: AddressFormState) => void
}

/**
 * Address form that conditionally renders the optional county/district/province
 * field based on the vendor configuration.  The `county` value is kept in the
 * parent's state so it persists when the user navigates to the payment page and
 * returns to the details page — fixing DEV-9.
 */
export function AddressForm({ vendor, value, onChange }: AddressFormProps) {
  function handleField(field: keyof AddressFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value })
    }
  }

  return (
    <fieldset
      className="address-form"
      data-test="DEV-9-address-form"
      data-vendor={vendor.vendorId}
    >
      <legend>Delivery address — {vendor.vendorName}</legend>

      <label className="form-field">
        <span>Street</span>
        <input
          type="text"
          value={value.street}
          onChange={handleField("street")}
          placeholder="Street and number"
          data-test="DEV-9-field-street"
        />
      </label>

      <label className="form-field">
        <span>City</span>
        <input
          type="text"
          value={value.city}
          onChange={handleField("city")}
          placeholder="City"
          data-test="DEV-9-field-city"
        />
      </label>

      <label className="form-field">
        <span>Postcode</span>
        <input
          type="text"
          value={value.postcode}
          onChange={handleField("postcode")}
          placeholder="Postcode"
          data-test="DEV-9-field-postcode"
        />
      </label>

      <label className="form-field">
        <span>Country</span>
        <input
          type="text"
          value={value.country}
          onChange={handleField("country")}
          placeholder="Country code (e.g. ES)"
          data-test="DEV-9-field-country"
        />
      </label>

      {vendor.countyFieldLabel && (
        <label className="form-field" data-test="DEV-9-field-county-wrapper">
          <span>
            {vendor.countyFieldLabel}{" "}
            <span className="optional-badge">(optional)</span>
          </span>
          <input
            type="text"
            value={value.county}
            onChange={handleField("county")}
            placeholder={vendor.countyFieldLabel}
            data-test="DEV-9-field-county"
          />
        </label>
      )}
    </fieldset>
  )
}
