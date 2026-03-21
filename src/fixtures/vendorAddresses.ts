import type { AddressFormState } from "../types/checkout"

/**
 * Test fixtures for vendor address forms.
 *
 * County values were previously excluded from fixture data, causing the
 * county field to appear empty in tests even though users could enter a value.
 * These fixtures now include the correct county values for each affected vendor
 * so that the full address (including the optional county field) is verified in
 * the test suite.
 *
 * Affected vendors: HF ES, HF PT, PBX IT (DEV-9)
 */
export const VENDOR_ADDRESS_FIXTURES: Record<string, AddressFormState> = {
  /** HF ES — Provincia: Comunidad de Madrid */
  "hf-es": {
    street: "Calle Gran Vía 1",
    city: "Madrid",
    postcode: "28013",
    country: "ES",
    county: "Comunidad de Madrid",
  },

  /** HF PT — Distrito: Belém */
  "hf-pt": {
    street: "Rua de Belém 4",
    city: "Lisboa",
    postcode: "1300-085",
    country: "PT",
    county: "Belém",
  },

  /** PBX IT — Provincia: Lazio */
  "pbx-it": {
    street: "Via del Corso 10",
    city: "Roma",
    postcode: "00186",
    country: "IT",
    county: "Lazio",
  },

  /** HF DE — no county field */
  "hf-de": {
    street: "Unter den Linden 1",
    city: "Berlin",
    postcode: "10117",
    country: "DE",
    county: "",
  },
}
