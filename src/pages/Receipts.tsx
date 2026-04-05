import React, { useState, useEffect } from 'react'
import { Download, Eye } from 'lucide-react'
import type { Receipt, ReceiptItem } from '../types'
import { getReceipts, getReceiptDetails } from '../services/supabaseClient'
import { downloadReceiptPDF } from '../utils/pdf'
import toast from 'react-hot-toast'

export const Receipts: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([])
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      setIsLoading(true)
      const data = await getReceipts()
      setReceipts(data || [])
    } catch (error) {
      console.error('Error fetching receipts:', error)
      toast.error('Failed to load receipts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (receipt: Receipt) => {
    try {
      const items = await getReceiptDetails(receipt.id)
      setReceiptItems(items || [])
      setSelectedReceipt(receipt)
      setShowDetails(true)
    } catch (error) {
      console.error('Error fetching receipt details:', error)
      toast.error('Failed to load receipt details')
    }
  }

  const handleDownloadPDF = async (receipt: Receipt) => {
    try {
      const items = await getReceiptDetails(receipt.id)
      downloadReceiptPDF(receipt, items || [], 'Grocery Shop')
      toast.success('Receipt downloaded successfully')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download receipt')
    }
  }

  const getPaymentModeBadgeColor = (mode: string) => {
    switch (mode) {
      case 'cash':
        return 'bg-green-100 text-green-800'
      case 'upi':
        return 'bg-blue-100 text-blue-800'
      case 'card':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading && receipts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">Receipt History</h1>

      {/* Details Modal */}
      {showDetails && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-50 border-b border-blue-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Receipt Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">receipt ID:</p>
                  <p className="font-semibold text-gray-900">{selectedReceipt.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedReceipt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Customer</p>
                  <p className="font-semibold text-gray-900">{selectedReceipt.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Mode</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getPaymentModeBadgeColor(selectedReceipt.payment_mode)}`}>
                    {selectedReceipt.payment_mode.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-2 px-3 font-semibold">Item</th>
                        <th className="text-center py-2 px-3 font-semibold">Qty</th>
                        <th className="text-right py-2 px-3 font-semibold">Price</th>
                        <th className="text-right py-2 px-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 px-3 text-gray-900">{item.item?.name || 'Unknown'}</td>
                          <td className="text-center py-2 px-3 text-gray-900">{item.quantity}</td>
                          <td className="text-right py-2 px-3 text-gray-900">₹{item.price.toFixed(2)}</td>
                          <td className="text-right py-2 px-3 font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900">₹{selectedReceipt.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="font-semibold text-green-600">₹{selectedReceipt.paid_amount.toFixed(2)}</span>
                </div>
                {selectedReceipt.total_amount > selectedReceipt.paid_amount && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-medium">Due Amount</span>
                    <span className="font-bold text-red-600">₹{(selectedReceipt.total_amount - selectedReceipt.paid_amount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedReceipt)}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipts Table */}
      {receipts.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Customer Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  Payment Mode
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Total Amount
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Paid Amount
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {receipt.customer_name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(receipt.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentModeBadgeColor(receipt.payment_mode)}`}>
                      {receipt.payment_mode.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                    ₹{receipt.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                    ₹{receipt.paid_amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDetails(receipt)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(receipt)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No receipts found. Create your first receipt!</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Receipts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{receipts.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{receipts.reduce((sum, r) => sum + r.total_amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Total Due</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            ₹{receipts.reduce((sum, r) => sum + (r.total_amount - r.paid_amount), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
