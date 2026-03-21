export interface VendorAddressConfig {
  vendorId: string
  vendorName: string
  /** Label shown for the county/district/province field. If undefined, field is hidden. */
  countyFieldLabel?: string
}

export interface AddressFormState {
  street: string
  city: string
  postcode: string
  country: string
  /** Optional county / district / province value — persisted across navigation */
  county: string
}

export interface CheckoutState {
  vendorId: string
  address: AddressFormState
  /** Page the user is currently on: "details" | "payment" | "summary" */
  page: "details" | "payment" | "summary"
}

export const EMPTY_ADDRESS: AddressFormState = {
  street: "",
  city: "",
  postcode: "",
  country: "",
  county: "",
}
