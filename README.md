# 🛒 Grocery Shop Receipt Management System

A modern, full-stack web application for managing receipts, items, billing, and debt tracking in a grocery shop. Built with React (Vite), Tailwind CSS, and Supabase.

## ✨ Features

### 🏠 Dashboard
- Total sales today
- Total receipts today
- Total pending debts
- Quick overview of key metrics

### 🛒 Item Management
- Add new items with prices
- Update existing items
- Delete items
- View all items in a table

### 🧾 Billing / Receipt System
- Create receipts with customer name and date
- Add multiple items with quantities
- Auto-calculate totals
- Support for 3 payment modes: Cash, UPI, Card
- Track paid and due amounts

### 💰 Debt Management
- Automatic debt tracking when payment < total
- View all pending debts
- Record partial payments
- Mark debts as cleared
- Debt status tracking

### 📊 Daily Reports
- Revenue by date
- Number of receipts
- Payment mode breakdown
- Collection rate metrics
- Export reports to CSV

### 📄 Receipt History
- View all receipts
- Filter and search receipts
- Download receipts as PDF
- View payment details

### 🔐 Admin Authentication
- Admin-only login (no registration)
- Session-based authentication
- Protected routes
- Auto-logout on session expiry

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **PDF Generation**: jsPDF
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Billing_management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to initialize
4. Go to Project Settings → API keys
5. Copy `Project URL` and `Anon Key`

### 4. Set Up Database Tables

Go to Supabase SQL Editor and run this script:

```sql
-- Create admins table
CREATE TABLE admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create receipts table
CREATE TABLE receipts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) NOT NULL,
  payment_mode TEXT CHECK (payment_mode IN ('cash', 'upi', 'card')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create receipt_items table
CREATE TABLE receipt_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id),
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create debts table
CREATE TABLE debts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  receipt_id UUID NOT NULL REFERENCES receipts(id),
  remaining_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo admin
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');
```

### 5. Configure Environment Variables

1. Create `.env.local` file in the project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 6. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 7. Login

Use the demo credentials:
- **Username**: `admin`
- **Password**: `admin123`

## 📦 Project Structure

```
src/
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Items.tsx
│   ├── Billing.tsx
│   ├── Receipts.tsx
│   ├── Debts.tsx
│   └── Reports.tsx
├── components/         # Reusable components
│   ├── Sidebar.tsx
│   └── ProtectedRoute.tsx
├── context/           # React contexts
│   └── AuthContext.tsx
├── services/          # API services
│   └── supabaseClient.ts
├── types/             # TypeScript types
│   └── index.ts
├── utils/             # Utility functions
│   └── pdf.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Deployment

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel auto-detects Vite and builds accordingly
5. Deploy!

**Build Command**: `npm run build`
**Output Directory**: `dist`

### Backend (Supabase)

- No deployment needed! Supabase handles everything
- Database, Auth, and API are all hosted

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 📱 Responsive Design

- ✅ Fully responsive
- ✅ Mobile-first approach
- ✅ Sidebar collapses on mobile
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized for all screen sizes

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for efficient grocery shop management**
# Bill-Management-System
