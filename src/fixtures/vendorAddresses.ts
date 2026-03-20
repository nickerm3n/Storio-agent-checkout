/**
 * Test fixture addresses for vendors that carry the optional county field.
 *
 * These values were previously removed from test suites because the county was
 * not being persisted. After the DEV-9 fix they should be restored so CI verifies
 * that county flows through the checkout state and into the order payload.
 */
import type { Address } from "../types/checkout"

/** HF ES — Comunidad de Madrid */
export const HF_ES_ADDRESS: Address = {
  firstName: "Lucía",
  lastName: "García",
  street: "Calle Gran Vía 1",
  city: "Madrid",
  postalCode: "28013",
  country: "ES",
  county: "Comunidad de Madrid",
}

/** HF PT — Belem */
export const HF_PT_ADDRESS: Address = {
  firstName: "João",
  lastName: "Silva",
  street: "Rua de Belém 10",
  city: "Lisboa",
  postalCode: "1400-038",
  country: "PT",
  county: "Belem",
}

/** PBX IT — Lazio */
export const PBX_IT_ADDRESS: Address = {
  firstName: "Giulia",
  lastName: "Rossi",
  street: "Via del Corso 5",
  city: "Roma",
  postalCode: "00186",
  country: "IT",
  county: "Lazio",
}
