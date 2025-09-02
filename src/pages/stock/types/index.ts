export interface IProduct {
    id: string
    name: string
    stock: number
    price: number
    consumed: number
}

export interface ProductPayload {
    name?: string
    stock?: number
    price?: number
    consumed?: number
}