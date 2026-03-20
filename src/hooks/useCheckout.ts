import { useState, useCallback } from "react"
import type { Address, OrderPayload, OrderItem } from "../types/checkout"

const EMPTY_ADDRESS: Address = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
  county: undefined,
}

export interface CheckoutState {
  vendorId: string
  address: Address
  items: OrderItem[]
  step: "details" | "payment" | "confirmation"
}

export interface UseCheckoutReturn {
  state: CheckoutState
  setVendor: (vendorId: string) => void
  updateAddress: (patch: Partial<Address>) => void
  goToPayment: () => void
  goBackToDetails: () => void
  submitOrder: () => OrderPayload
}

export function useCheckout(
  defaultVendorId: string,
  defaultItems: OrderItem[] = [],
): UseCheckoutReturn {
  const [state, setState] = useState<CheckoutState>({
    vendorId: defaultVendorId,
    address: { ...EMPTY_ADDRESS },
    items: defaultItems,
    step: "details",
  })

  const setVendor = useCallback((vendorId: string) => {
    setState((prev) => ({ ...prev, vendorId }))
  }, [])

  /**
   * Merge a partial address update into state.
   * County is explicitly preserved: passing `county: ""` clears it to undefined
   * so it is omitted from the order payload, but passing `county: "Lazio"` saves it.
   */
  const updateAddress = useCallback((patch: Partial<Address>) => {
    setState((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        ...patch,
        // Normalise empty string to undefined so the field is truly absent
        county:
          patch.county !== undefined
            ? patch.county === ""
              ? undefined
              : patch.county
            : prev.address.county,
      },
    }))
  }, [])

  const goToPayment = useCallback(() => {
    setState((prev) => ({ ...prev, step: "payment" }))
  }, [])

  /** Navigate back to the details page — address (including county) is preserved in state. */
  const goBackToDetails = useCallback(() => {
    setState((prev) => ({ ...prev, step: "details" }))
  }, [])

  /** Build and return the order payload, including county when present. */
  const submitOrder = useCallback((): OrderPayload => {
    const { address } = state
    const serialisedAddress: Address = {
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      // Include county only when it has a value — matches Order API expectations
      ...(address.county ? { county: address.county } : {}),
    }

    setState((prev) => ({ ...prev, step: "confirmation" }))

    return {
      vendor: state.vendorId,
      address: serialisedAddress,
      items: state.items,
    }
  }, [state])

  return { state, setVendor, updateAddress, goToPayment, goBackToDetails, submitOrder }
}
