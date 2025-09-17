import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { logout, darkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => setShowConfirm(true);
    const confirmLogout = () => {
        logout();
        setShowConfirm(false);
        navigate("/login");
    };

    return (
        <nav className={`px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md bg-blue-600`}>

            {/* Brand */}
            <div className="font-bold text-lg mb-2 sm:mb-0">
                <Link to="/">School Payments</Link>
            </div>

            {/* Links and actions */}
            <div className="flex flex-wrap items-center gap-3">
                <Link to="/transactions" className="hover:underline">Transactions</Link>
                <Link to="/transactions-by-school" className="hover:underline">By School</Link>
                <Link to="/transaction-status" className="hover:underline">Check Status</Link>

                {/* Dark/Light Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className={`px-3 py-1 rounded-lg transition  cursor-pointer
            ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-sm cursor-pointer"
                >
                    Logout
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-gray-800 dark:bg-gray-700 mx-2 rounded-xl p-6 shadow-lg w-80 text-center">
                        <p className="mb-4 text-white">Do you want to logout?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
