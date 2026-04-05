import React, { useState, useEffect } from 'react'
import { BarChart3, ShoppingCart, AlertCircle, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '../services/supabaseClient'
import toast from 'react-hot-toast'

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalReceipts: 0,
    totalDebts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard stats')
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: React.ElementType
    title: string
    value: string | number
    color: string
  }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={28} />
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to Grocery Shop Receipt Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Total Sales Today"
          value={`₹${stats.totalSales.toFixed(2)}`}
          color="bg-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Receipts Today"
          value={stats.totalReceipts}
          color="bg-blue-600"
        />
        <StatCard
          icon={AlertCircle}
          title="Total Pending Debts"
          value={`₹${stats.totalDebts.toFixed(2)}`}
          color="bg-red-600"
        />
      </div>

      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="text-blue-600" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Get Started
            </h2>
            <p className="text-gray-600 mt-1">
              Use the sidebar to manage items, create receipts, track debts, and view reports.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Transactions</span>
              <span className="font-semibold text-gray-900">{stats.totalReceipts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">₹{stats.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Average Transaction</span>
              <span className="font-semibold text-gray-900">
                ₹{stats.totalReceipts > 0 ? (stats.totalSales / stats.totalReceipts).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
          <div className="space-y-3">
            {stats.totalDebts > 0 ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Warning:</strong> You have pending debts of ₹{stats.totalDebts.toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ No pending debts. Great job!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
