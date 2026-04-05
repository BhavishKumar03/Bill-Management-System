import React, { useState, useEffect } from 'react'
import { AlertCircle, DollarSign, Check } from 'lucide-react'
import type { Debt } from '../types'
import { getDebts, updateDebtPayment, markDebtPaid } from '../services/supabaseClient'
import toast from 'react-hot-toast'

export const Debts: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<{ [key: string]: string }>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  useEffect(() => {
    fetchDebts()
  }, [])

  const fetchDebts = async () => {
    try {
      setIsLoading(true)
      const data = await getDebts()
      setDebts(data || [])
    } catch (error) {
      console.error('Error fetching debts:', error)
      toast.error('Failed to load debts')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentChange = (debtId: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [debtId]: value
    }))
  }

  const handleMarkPaid = async (debtId: string) => {
    try {
      setSubmittingId(debtId)
      await markDebtPaid(debtId)
      toast.success('Debt marked as paid')
      fetchDebts()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to mark debt as paid')
    } finally {
      setSubmittingId(null)
    }
  }

  const handleUpdatePayment = async (debtId: string) => {
    const amount = paymentData[debtId]

    if (!amount) {
      toast.error('Please enter payment amount')
      return
    }

    const paymentAmount = parseFloat(amount)
    if (paymentAmount <= 0) {
      toast.error('Payment amount must be greater than 0')
      return
    }

    const debt = debts.find(d => d.id === debtId)
    if (!debt || paymentAmount > debt.remaining_amount) {
      toast.error('Payment amount cannot exceed remaining debt')
      return
    }

    try {
      setSubmittingId(debtId)
      await updateDebtPayment(debtId, paymentAmount)
      toast.success('Payment recorded successfully')
      setPaymentData(prev => {
        const newData = { ...prev }
        delete newData[debtId]
        return newData
      })
      fetchDebts()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to update payment')
    } finally {
      setSubmittingId(null)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const pendingDebts = debts.filter(d => d.status === 'pending')
  const paidDebts = debts.filter(d => d.status === 'paid')
  const totalPendingAmount = pendingDebts.reduce((sum, d) => sum + d.remaining_amount, 0)

  if (isLoading && debts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">Debt Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Pending Debts</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{pendingDebts.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={28} />
            </div>
          </div>
        </div>

        <div className="card border-2 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Total Due Amount</p>
              <p className="text-3xl font-bold text-orange-700 mt-2">
                ₹{totalPendingAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="text-orange-600" size={28} />
            </div>
          </div>
        </div>

        <div className="card border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Cleared Debts</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{paidDebts.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="text-green-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Debts */}
      {pendingDebts.length > 0 ? (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Debts</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-right py-3 px-4 font-semibold">Due Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Payment</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDebts.map((debt) => (
                  <tr key={debt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {debt.customer_name}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-red-600">
                      ₹{debt.remaining_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(debt.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        step="0.01"
                        max={debt.remaining_amount}
                        value={paymentData[debt.id] || ''}
                        onChange={(e) => handlePaymentChange(debt.id, e.target.value)}
                        disabled={submittingId === debt.id}
                        className="input-field text-sm max-w-32"
                        placeholder="Amount"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleUpdatePayment(debt.id)}
                          disabled={submittingId === debt.id || !paymentData[debt.id]}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {submittingId === debt.id ? 'Processing...' : 'Pay'}
                        </button>
                        <button
                          onClick={() => handleMarkPaid(debt.id)}
                          disabled={submittingId === debt.id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {submittingId === debt.id ? 'Processing...' : 'Paid'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12 bg-green-50 border-2 border-green-200">
          <Check className="text-green-600 mx-auto mb-3" size={48} />
          <p className="text-green-700 text-lg font-semibold">No pending debts!</p>
          <p className="text-green-600 mt-1">All debts have been cleared.</p>
        </div>
      )}

      {/* Paid Debts History */}
      {paidDebts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cleared Debts</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount Paid</th>
                  <th className="text-left py-3 px-4 font-semibold">Cleared Date</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paidDebts.map((debt) => (
                  <tr key={debt.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {debt.customer_name}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      ₹{debt.remaining_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(debt.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(debt.status)}`}>
                        {debt.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
