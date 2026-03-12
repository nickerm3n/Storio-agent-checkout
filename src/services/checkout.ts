export type CheckoutItem = {
  sku: string
  quantity: number
  priceCents: number
}

export type CheckoutRequest = {
  email: string
  promoCode?: string
  items: CheckoutItem[]
}

export type CheckoutResponse = {
  orderId: string
  totalCents: number
}

export function calculateSubtotal(items: CheckoutItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
}

export function applyPromo(subtotalCents: number, promoCode?: string): number {
  if (promoCode?.trim().toUpperCase() !== "SAVE10") {
    return subtotalCents
  }

  const discount = Math.round(subtotalCents * 0.1)
  return subtotalCents - discount
}

export function increaseQuantity(quantity: number): number {
  return quantity + 1
}

export function decreaseQuantity(quantity: number): number {
  return Math.max(1, quantity - 1)
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100)
}

export async function placeOrder(request: CheckoutRequest): Promise<CheckoutResponse> {
  const subtotalCents = calculateSubtotal(request.items)
  const totalCents = applyPromo(subtotalCents, request.promoCode)

  return {
    orderId: `demo-${Date.now()}`,
    totalCents
  }
}
