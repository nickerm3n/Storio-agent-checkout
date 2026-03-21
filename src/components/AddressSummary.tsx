import React from "react"
import type { AddressFormState } from "../types/checkout"

interface AddressSummaryProps {
  address: AddressFormState
  countyFieldLabel?: string
}

/**
 * Read-only address summary shown on the order summary / payment page.
 * Renders the optional county value when present — fixing the missing county
 * in the order summary reported in DEV-9.
 */
export function AddressSummary({ address, countyFieldLabel }: AddressSummaryProps) {
  return (
    <dl className="address-summary" data-test="DEV-9-address-summary">
      <div className="summary-row">
        <dt>Street</dt>
        <dd>{address.street || "—"}</dd>
      </div>
      <div className="summary-row">
        <dt>City</dt>
        <dd>{address.city || "—"}</dd>
      </div>
      <div className="summary-row">
        <dt>Postcode</dt>
        <dd>{address.postcode || "—"}</dd>
      </div>
      <div className="summary-row">
        <dt>Country</dt>
        <dd>{address.country || "—"}</dd>
      </div>
      {countyFieldLabel && (
        <div className="summary-row" data-test="DEV-9-summary-county">
          <dt>{countyFieldLabel}</dt>
          <dd>{address.county || "—"}</dd>
        </div>
      )}
    </dl>
  )
}
