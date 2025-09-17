import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import TransactionsBySchool from "./pages/TransactionsBySchool";
import TransactionStatusCheck from "./pages/TransactionStatusCheck";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";

// ✅ Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { darkMode } = useAuth();
  const hideNavbar = location.pathname === "/login";

  // ✅ Apply dark mode to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827'; // gray-900
      document.body.style.color = '#f9fafb'; // gray-100
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb'; // gray-50
      document.body.style.color = '#111827'; // gray-900
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode
      ? "bg-gray-900 text-gray-100"
      : "bg-gray-50 text-gray-900"
      }`}>
      {!hideNavbar && <Navbar />}
      <main className="flex-1 p-6 min-h-[calc(100vh-64px)]">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

// ✅ App content that uses AuthContext
const AppContent = () => {
  const { darkMode } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode
      ? "bg-gray-900 text-gray-100"
      : "bg-gray-50 text-gray-900"
      }`}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Redirect root → /transactions if logged in */}
            <Route path="/" element={<Navigate to="/transactions" replace />} />

            {/* Protected Routes */}
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions-by-school"
              element={
                <PrivateRoute>
                  <TransactionsBySchool />
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction-status"
              element={
                <PrivateRoute>
                  <TransactionStatusCheck />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;