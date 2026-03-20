import type { VendorConfig } from "../types/vendor"

export const VENDORS: VendorConfig[] = [
  {
    id: "HF_ES",
    name: "HF España",
    country: "ES",
    hasCounty: true,
    countyLabel: "Comunidad autónoma",
  },
  {
    id: "HF_PT",
    name: "HF Portugal",
    country: "PT",
    hasCounty: true,
    countyLabel: "Distrito / Região",
  },
  {
    id: "PBX_IT",
    name: "PBX Italia",
    country: "IT",
    hasCounty: true,
    countyLabel: "Regione",
  },
  {
    id: "HF_DE",
    name: "HF Deutschland",
    country: "DE",
    hasCounty: false,
  },
]

export function getVendorById(id: string): VendorConfig | undefined {
  return VENDORS.find((v) => v.id === id)
}
