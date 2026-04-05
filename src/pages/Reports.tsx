import React, { useState, useEffect } from 'react'
import { BarChart3, Download, Calendar } from 'lucide-react'
import type { Receipt } from '../types'
import { getDailyReport } from '../services/supabaseClient'
import toast from 'react-hot-toast'

export const Reports: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [selectedDate])

  const fetchReport = async () => {
    try {
      setIsLoading(true)
      const data = await getDailyReport(selectedDate)
      setReceipts(data || [])
    } catch (error) {
      console.error('Error fetching report:', error)
      toast.error('Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  const generateCSVReport = () => {
    if (receipts.length === 0) {
      toast.error('No data to export')
      return
    }

    let csv = 'Customer Name,Total Amount,Paid Amount,Due,Payment Mode,Date\n'

    receipts.forEach(receipt => {
      const dueAmount = receipt.total_amount - receipt.paid_amount
      csv += `"${receipt.customer_name}",${receipt.total_amount},${receipt.paid_amount},${dueAmount},"${receipt.payment_mode}","${new Date(receipt.created_at).toLocaleDateString()}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Report exported successfully')
  }

  const totalAmount = receipts.reduce((sum, r) => sum + r.total_amount, 0)
  const totalPaid = receipts.reduce((sum, r) => sum + r.paid_amount, 0)
  const totalDue = totalAmount - totalPaid
  const avgTransactionValue = receipts.length > 0 ? totalAmount / receipts.length : 0

  const paymentModes = {
    cash: receipts.filter(r => r.payment_mode === 'cash').length,
    upi: receipts.filter(r => r.payment_mode === 'upi').length,
    card: receipts.filter(r => r.payment_mode === 'card').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Daily Reports</h1>
        <button
          onClick={generateCSVReport}
          disabled={receipts.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Date Selector */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing data for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Transactions</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{receipts.length}</p>
        </div>

        <div className="card">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <p className="text-gray-600 text-sm">Total Collected</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ₹{totalPaid.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <p className="text-gray-600 text-sm">Avg Transaction</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ₹{avgTransactionValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Modes Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Cash Payments</p>
              <p className="text-2xl font-bold text-green-700 mt-2">{paymentModes.cash}</p>
            </div>
            <div className="text-4xl font-bold text-green-200">₹</div>
          </div>
        </div>

        <div className="card border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">UPI Payments</p>
              <p className="text-2xl font-bold text-blue-700 mt-2">{paymentModes.upi}</p>
            </div>
            <div className="text-4xl font-bold text-blue-200">📱</div>
          </div>
        </div>

        <div className="card border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-medium">Card Payments</p>
              <p className="text-2xl font-bold text-purple-700 mt-2">{paymentModes.card}</p>
            </div>
            <div className="text-4xl font-bold text-purple-200">💳</div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Financial Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Money Collected</span>
              <span className="font-semibold text-green-600">₹{totalPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Outstanding Due</span>
              <span className="font-semibold text-red-600">₹{totalDue.toFixed(2)}</span>
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: totalAmount > 0 ? `${(totalPaid / totalAmount) * 100}%` : '0%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Collection Rate: {totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Number of Transactions</p>
              <p className="text-2xl font-bold text-blue-900">{receipts.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Average Transaction Value</p>
              <p className="text-2xl font-bold text-green-900">₹{avgTransactionValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">Number of Partial Payments</p>
              <p className="text-2xl font-bold text-orange-900">
                {receipts.filter(r => r.total_amount > r.paid_amount).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Transactions */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      ) : receipts.length > 0 ? (
        <div className="card overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Transactions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                <th className="text-center py-3 px-4 font-semibold">Payment Mode</th>
                <th className="text-right py-3 px-4 font-semibold">Total</th>
                <th className="text-right py-3 px-4 font-semibold">Paid</th>
                <th className="text-right py-3 px-4 font-semibold">Due</th>
                <th className="text-left py-3 px-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => {
                const dueAmount = receipt.total_amount - receipt.paid_amount
                return (
                  <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{receipt.customer_name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {receipt.payment_mode.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      ₹{receipt.total_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      ₹{receipt.paid_amount.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{dueAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(receipt.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No receipts found for this date</p>
        </div>
      )}
    </div>
  )
}
