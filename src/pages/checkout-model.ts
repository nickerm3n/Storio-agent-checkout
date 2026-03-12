export type CheckoutItem = {
  id: string
  name: string
  unitPriceCents: number
  quantity: number
}

export type CheckoutSummary = {
  subtotalCents: number
  discountCents: number
  totalCents: number
  promoCode: string | null
}

const PROMO_CODE = "SAVE10"

export function createCheckoutSummary(
  items: CheckoutItem[],
  promoCode: string | null = null
): CheckoutSummary {
  const subtotalCents = items.reduce((sum, item) => {
    return sum + item.unitPriceCents * item.quantity
  }, 0)

  const normalizedCode = promoCode?.trim().toUpperCase() ?? null
  const hasPromo = normalizedCode === PROMO_CODE
  const discountCents = hasPromo ? Math.round(subtotalCents * 0.1) : 0

  return {
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
    promoCode: hasPromo ? PROMO_CODE : null
  }
}

export function togglePromoCode(currentPromoCode: string | null): string | null {
  return currentPromoCode ? null : PROMO_CODE
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100)
}
