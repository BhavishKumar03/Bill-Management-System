import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate credentials
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Admin Authentication
export const adminLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', email)
      .eq('password', password)
      .single()

    if (error) {
      throw new Error('Invalid email or password')
    }
    return data
  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }
}

// Items
export const getItems = async () => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('Error fetching items:', error)
    return []
  }
}

export const addItem = async (name: string, price: number) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .insert([{ name, price }])
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error adding item:', error)
    throw new Error('Failed to add item. Check your Supabase configuration.')
  }
}

export const updateItem = async (id: string, name: string, price: number) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .update({ name, price })
      .eq('id', id)
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error updating item:', error)
    throw new Error('Failed to update item. Check your Supabase configuration.')
  }
}

export const deleteItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting item:', error)
    throw new Error('Failed to delete item. Check your Supabase configuration.')
  }
}

// Receipts
export const createReceipt = async (
  customerName: string,
  totalAmount: number,
  paidAmount: number,
  paymentMode: 'cash' | 'upi' | 'card',
  items: Array<{ itemId: string; quantity: number; price: number }>
) => {
  try {
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert([{ customer_name: customerName, total_amount: totalAmount, paid_amount: paidAmount, payment_mode: paymentMode }])
      .select()
      .single()

    if (receiptError) throw receiptError

    const receiptItems = items.map(item => ({
      receipt_id: receipt.id,
      item_id: item.itemId,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('receipt_items')
      .insert(receiptItems)

    if (itemsError) throw itemsError

    if (paidAmount < totalAmount) {
      const { error: debtError } = await supabase
        .from('debts')
        .insert([{
          customer_name: customerName,
          receipt_id: receipt.id,
          remaining_amount: totalAmount - paidAmount,
          status: 'pending'
        }])

      if (debtError) throw debtError
    }

    return receipt
  } catch (error) {
    console.error('Error creating receipt:', error)
    throw new Error('Failed to create receipt. Check your Supabase configuration.')
  }
}

export const getReceipts = async () => {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('Error fetching receipts:', error)
    return []
  }
}

export const getReceiptDetails = async (receiptId: string) => {
  try {
    const { data, error } = await supabase
      .from('receipt_items')
      .select('*, item:item_id(id, name, price)')
      .eq('receipt_id', receiptId)

    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('Error fetching receipt details:', error)
    return []
  }
}

// Debts
export const getDebts = async () => {
  try {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('Error fetching debts:', error)
    return []
  }
}

export const updateDebtPayment = async (debtId: string, paidAmount: number) => {
  try {
    const { data: debt, error: fetchError } = await supabase
      .from('debts')
      .select('*')
      .eq('id', debtId)
      .single()

    if (fetchError) throw fetchError

    const newRemaining = debt.remaining_amount - paidAmount
    const status = newRemaining <= 0 ? 'paid' : 'pending'

    const { data, error } = await supabase
      .from('debts')
      .update({
        remaining_amount: Math.max(0, newRemaining),
        status
      })
      .eq('id', debtId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating debt payment:', error)
    throw new Error('Failed to update payment. Check your Supabase configuration.')
  }
}

export const markDebtPaid = async (debtId: string) => {
  try {
    const { data, error } = await supabase
      .from('debts')
      .update({ status: 'paid', remaining_amount: 0 })
      .eq('id', debtId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error marking debt paid:', error)
    throw new Error('Failed to mark debt as paid. Check your Supabase configuration.')
  }
}

// Dashboard
export const getDashboardStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select('total_amount, paid_amount')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)

    if (receiptsError) throw receiptsError

    const { data: debts, error: debtsError } = await supabase
      .from('debts')
      .select('remaining_amount')
      .eq('status', 'pending')

    if (debtsError) throw debtsError

    const totalSales = (receipts?.reduce((sum: number, r: any) => sum + r.total_amount, 0) || 0) as number
    const totalReceipts = receipts?.length || 0
    const totalDebts = (debts?.reduce((sum: number, d: any) => sum + d.remaining_amount, 0) || 0) as number

    return { totalSales, totalReceipts, totalDebts }
  } catch (error) {
    console.warn('Error fetching dashboard stats:', error)
    return { totalSales: 0, totalReceipts: 0, totalDebts: 0 }
  }
}

// Reports
export const getDailyReport = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .gte('created_at', `${date}T00:00:00`)
      .lte('created_at', `${date}T23:59:59`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('Error fetching report:', error)
    return []
  }
}
