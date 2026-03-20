export interface Address {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
  /** Optional county/region field — present for HF ES, HF PT, PBX IT */
  county?: string
}

export interface OrderPayload {
  vendor: string
  address: Address
  items: OrderItem[]
}

export interface OrderItem {
  productId: string
  quantity: number
}
