export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Admin {
  id: string
  username: string
  password: string
  created_at: string
}

export interface Item {
  id: string
  name: string
  price: number
  created_at: string
}

export interface Receipt {
  id: string
  customer_name: string
  total_amount: number
  paid_amount: number
  payment_mode: 'cash' | 'upi' | 'card'
  created_at: string
}

export interface ReceiptItem {
  id: string
  receipt_id: string
  item_id: string
  quantity: number
  price: number
  item?: Item
}

export interface Debt {
  id: string
  customer_name: string
  receipt_id: string
  remaining_amount: number
  status: 'pending' | 'paid'
  created_at: string
}

export interface AuthContextType {
  admin: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
