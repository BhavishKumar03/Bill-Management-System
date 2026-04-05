import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'
import type { Item } from '../types'
import { getItems, createReceipt } from '../services/supabaseClient'
import toast from 'react-hot-toast'

interface BillingItem {
  itemId: string
  quantity: number
  price: number
  name: string
}

export const Billing: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [billingItems, setBillingItems] = useState<BillingItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card'>('cash')
  const [paidAmount, setPaidAmount] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const data = await getItems()
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = () => {
    if (!selectedItemId || !quantity) {
      toast.error('Please select an item and quantity')
      return
    }

    const item = items.find(i => i.id === selectedItemId)
    if (!item) {
      toast.error('Invalid item selected')
      return
    }

    const quantityNum = parseFloat(quantity)
    if (quantityNum <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    const billingItem: BillingItem = {
      itemId: selectedItemId,
      name: item.name,
      price: item.price,
      quantity: quantityNum
    }

    setBillingItems([...billingItems, billingItem])
    setSelectedItemId('')
    setQuantity('')
    toast.success('Item added to billing')
  }

  const handleRemoveItem = (index: number) => {
    setBillingItems(billingItems.filter((_, i) => i !== index))
  }

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName) {
      toast.error('Please enter customer name')
      return
    }

    if (billingItems.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    if (!paidAmount) {
      toast.error('Please enter paid amount')
      return
    }

    const totalAmount = calculateTotal()
    const paidAmountNum = parseFloat(paidAmount)

    if (paidAmountNum < 0) {
      toast.error('Paid amount cannot be negative')
      return
    }

    try {
      setIsSubmitting(true)

      await createReceipt(
        customerName,
        totalAmount,
        paidAmountNum,
        paymentMode,
        billingItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price
        }))
      )

      toast.success('Receipt created successfully!')
      resetForm()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to create receipt')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    return billingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const resetForm = () => {
    setCustomerName('')
    setBillingItems([])
    setPaidAmount('')
    setPaymentMode('cash')
    setSelectedItemId('')
    setQuantity('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const totalAmount = calculateTotal()
  const dueAmount = totalAmount - parseFloat(paidAmount || '0')

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">Create Receipt</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Payment Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode *
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as 'cash' | 'upi' | 'card')}
                  className="input-field"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Items
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Item *
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- Select Item --</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (₹{item.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-field"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Items */}
          {billingItems.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Billing Items
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold">Item</th>
                      <th className="text-center py-2 px-3 font-semibold">Qty</th>
                      <th className="text-right py-2 px-3 font-semibold">Price</th>
                      <th className="text-right py-2 px-3 font-semibold">Total</th>
                      <th className="text-center py-2 px-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-900">{item.name}</td>
                        <td className="text-center py-2 px-3 text-gray-900">{item.quantity}</td>
                        <td className="text-right py-2 px-3 text-gray-900">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-3 font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="text-center py-2 px-3">
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Summary & Payment */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div className={`p-3 rounded-lg ${dueAmount > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex justify-between">
                  <span className={dueAmount > 0 ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold'}>
                    {dueAmount > 0 ? 'Amount Due:' : 'Paid:'}
                  </span>
                  <span className={dueAmount > 0 ? 'text-red-700 font-bold text-lg' : 'text-green-700 font-bold text-lg'}>
                    ₹{Math.abs(dueAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreateReceipt}
            disabled={isSubmitting || billingItems.length === 0 || !customerName || !paidAmount}
            className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSubmitting ? 'Creating Receipt...' : 'Create Receipt'}
          </button>

          <button
            onClick={resetForm}
            type="button"
            className="w-full btn-secondary py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
