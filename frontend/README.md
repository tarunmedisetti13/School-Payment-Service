# School Payment Service - Frontend

A React application for managing payments and viewing transactions with a clean, responsive interface.

## Quick Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
VITE_BACKEND_URI=http://localhost:5000

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Application Features

### 🔐 Login System
**Route:** `/login`

- Secure JWT-based authentication
- Password visibility toggle
- Error handling with user messages
- Auto-redirect to dashboard on success

**Note:** No signup available in frontend. Create users via backend API:
```bash
POST /api/user/create-user
{
  "username": "admin",
  "email": "admin@example.com", 
  "password": "password123"
}
```

**Screenshot:** `./login.png`

---

### 📊 Transactions Dashboard
**Route:** `/transactions`

- View all transactions in real-time
- **Filter by:**
  - Status (SUCCESS, PENDING, FAILED)
  - School ID
  - Date (YYYY-MM-DD)
- **Sort by:**
  - Created date
  - Order amount
  - Transaction amount
- Pagination with customizable page size
- Color-coded status badges
- URL synchronization for shareable filters

**Screenshot:** `./transactions.png`

---

### 🏫 School Transactions
**Route:** `/school-transactions`

- Search transactions by specific School ID
- Advanced sorting options
- Pagination support
- Error handling for invalid School IDs
- Empty state for schools with no transactions

**How to use:**
1. Enter School ID in search bar
2. Press Enter or click Search
3. View school-specific results

**Screenshot:** `./transactions-by-school.png`

---

### 🔍 Transaction Status Checker
**Route:** `/status-check`

- Quick lookup by Custom Order ID
- Real-time status display:
  - ✅ SUCCESS
  - ⏳ PENDING
  - ❌ FAILED
  - 🚫 NOT FOUND
- Detailed transaction information
- User-friendly error messages

**How to use:**
1. Enter Custom Order ID
2. Click "Check Status"
3. View instant results

**Screenshot:** `./transactions-check.png`

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Fetch API** for backend communication

## Getting Started

1. **Start Backend API** (see backend README)
2. **Create user credentials** via backend API
3. **Run frontend:** `npm run dev`
4. **Login** with created credentials
5. **Navigate** through different features