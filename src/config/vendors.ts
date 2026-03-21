import type { VendorAddressConfig } from "../types/checkout"

/**
 * Vendors that expose an optional county / district / province field in their
 * address form.  The `countyFieldLabel` drives both visibility and labelling of
 * the field — if it is absent the field is hidden for that vendor.
 */
export const VENDORS: VendorAddressConfig[] = [
  {
    vendorId: "hf-es",
    vendorName: "HF ES",
    countyFieldLabel: "Provincia",
  },
  {
    vendorId: "hf-pt",
    vendorName: "HF PT",
    countyFieldLabel: "Distrito",
  },
  {
    vendorId: "pbx-it",
    vendorName: "PBX IT",
    countyFieldLabel: "Provincia",
  },
  {
    vendorId: "hf-de",
    vendorName: "HF DE",
    // No county field for Germany
  },
]

export function getVendor(vendorId: string): VendorAddressConfig | undefined {
  return VENDORS.find((v) => v.vendorId === vendorId)
}
