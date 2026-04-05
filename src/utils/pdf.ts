import { jsPDF } from 'jspdf'
import type { Receipt, ReceiptItem } from '../types'

export const generateReceiptPDF = (
  receipt: Receipt,
  items: ReceiptItem[],
  shopName: string = 'Grocery Shop'
) => {
  const pdf = new jsPDF()
  let yPos = 15

  // Header - Shop Name and Title
  pdf.setFontSize(18)
  pdf.setFont('', 'bold')
  pdf.text(shopName, 105, yPos, { align: 'center' })
  yPos += 8

  pdf.setFontSize(14)
  pdf.text('RECEIPT', 105, yPos, { align: 'center' })
  yPos += 6

  // Receipt Number and Date
  pdf.setFontSize(10)
  pdf.setFont('', 'normal')
  const receiptDate = new Date(receipt.created_at).toLocaleDateString()
  const receiptTime = new Date(receipt.created_at).toLocaleTimeString()
  pdf.text(`Receipt #: ${receipt.id.slice(-8).toUpperCase()}`, 15, yPos)
  pdf.text(`Date: ${receiptDate}`, 150, yPos)
  yPos += 6
  pdf.text(`Time: ${receiptTime}`, 150, yPos)
  yPos += 10

  // Customer Information
  pdf.setFont('', 'bold')
  pdf.setFontSize(11)
  pdf.text('Customer Information:', 15, yPos)
  yPos += 6
  pdf.setFont('', 'normal')
  pdf.setFontSize(10)
  pdf.text(`Name: ${receipt.customer_name}`, 15, yPos)
  yPos += 8

  // Items Table Header
  pdf.setFont('', 'bold')
  pdf.setFontSize(10)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(15, yPos - 3, 180, 8, 'F')
  pdf.text('Item Description', 20, yPos + 2)
  pdf.text('Qty', 120, yPos + 2)
  pdf.text('Rate', 145, yPos + 2)
  pdf.text('Amount', 170, yPos + 2)
  yPos += 8

  // Table border
  pdf.setDrawColor(200, 200, 200)
  pdf.rect(15, yPos - 11, 180, items.length * 8 + 12)

  // Items
  pdf.setFont('', 'normal')
  pdf.setFontSize(9)
  let totalAmount = 0

  items.forEach((item, index) => {
    const itemTotal = item.quantity * item.price
    totalAmount += itemTotal
    const itemName = item.item?.name || 'Unknown Item'

    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250)
      pdf.rect(15, yPos - 4, 180, 6, 'F')
    }

    // Wrap long item names
    const lines = pdf.splitTextToSize(itemName, 90)
    pdf.text(lines, 20, yPos)
    pdf.text(item.quantity.toString(), 125, yPos)
    pdf.text(`₹${item.price.toFixed(2)}`, 145, yPos)
    pdf.text(`₹${itemTotal.toFixed(2)}`, 170, yPos)

    yPos += Math.max(6, lines.length * 4)
  })

  // Totals Section
  yPos += 5
  pdf.setDrawColor(0, 0, 0)
  pdf.line(15, yPos, 195, yPos)
  yPos += 8

  pdf.setFont('', 'bold')
  pdf.setFontSize(10)
  pdf.text(`Total Amount: ₹${receipt.total_amount.toFixed(2)}`, 140, yPos)
  yPos += 6

  pdf.setFont('', 'normal')
  pdf.text(`Amount Paid: ₹${receipt.paid_amount.toFixed(2)}`, 140, yPos)
  yPos += 6

  const dueAmount = receipt.total_amount - receipt.paid_amount
  if (dueAmount > 0) {
    pdf.setFont('', 'bold')
    pdf.setTextColor(255, 0, 0)
    pdf.text(`Balance Due: ₹${dueAmount.toFixed(2)}`, 140, yPos)
    pdf.setTextColor(0, 0, 0)
  } else if (dueAmount < 0) {
    pdf.setFont('', 'bold')
    pdf.setTextColor(0, 128, 0)
    pdf.text(`Change: ₹${Math.abs(dueAmount).toFixed(2)}`, 140, yPos)
    pdf.setTextColor(0, 0, 0)
  }
  yPos += 10

  // Payment Information
  pdf.setFont('', 'bold')
  pdf.setFontSize(10)
  pdf.text('Payment Information:', 15, yPos)
  yPos += 6
  pdf.setFont('', 'normal')
  pdf.setFontSize(9)
  pdf.text(`Payment Mode: ${receipt.payment_mode.toUpperCase()}`, 15, yPos)
  yPos += 6
  pdf.text(`Payment Status: ${dueAmount <= 0 ? 'PAID' : 'PARTIAL'}`, 15, yPos)
  yPos += 15

  // Footer
  pdf.setFontSize(8)
  pdf.setFont('', 'italic')
  pdf.text('Thank you for shopping with us!', 105, yPos, { align: 'center' })
  yPos += 4
  pdf.text('This is a computer generated receipt.', 105, yPos, { align: 'center' })

  return pdf
}

export const downloadReceiptPDF = (
  receipt: Receipt,
  items: ReceiptItem[],
  shopName?: string
) => {
  const pdf = generateReceiptPDF(receipt, items, shopName)
  const filename = `receipt_${receipt.customer_name}_${new Date(receipt.created_at).toISOString().split('T')[0]}.pdf`
  pdf.save(filename)
}
