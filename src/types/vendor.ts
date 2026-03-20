export interface VendorConfig {
  id: string
  name: string
  /** Country code (ISO 3166-1 alpha-2) handled by this vendor */
  country: string
  /** Whether the address form should show an optional county/region field */
  hasCounty: boolean
  /** Human-readable label for the county field (varies by locale) */
  countyLabel?: string
}
