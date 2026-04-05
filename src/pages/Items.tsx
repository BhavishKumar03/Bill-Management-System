import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import type { Item } from '../types'
import { getItems, addItem, updateItem, deleteItem } from '../services/supabaseClient'
import toast from 'react-hot-toast'

export const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', price: '' })

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      if (editingId) {
        // Update item
        await updateItem(editingId, formData.name, parseFloat(formData.price))
        toast.success('Item updated successfully')
      } else {
        // Add new item
        await addItem(formData.name, parseFloat(formData.price))
        toast.success('Item added successfully')
      }

      fetchItems()
      setFormData({ name: '', price: '' })
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save item')
    }
  }

  const handleEdit = (item: Item) => {
    setFormData({ name: item.name, price: item.price.toString() })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      await deleteItem(id)
      toast.success('Item deleted successfully')
      fetchItems()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', price: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Items Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Item
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Item' : 'Add New Item'}
          </h2>

          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Save size={20} />
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      {items.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Item Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Added On
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
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
          <p className="text-gray-600 text-lg">No items found. Add your first item!</p>
        </div>
      )}
    </div>
  )
}
