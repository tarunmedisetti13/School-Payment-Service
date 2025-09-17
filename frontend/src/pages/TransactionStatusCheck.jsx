import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const TransactionStatusCheck = () => {
    const { darkMode, api } = useAuth(); // ✅ dark/light mode
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await api.get(`/payments/transaction-status/${orderId}`);
            setResult(res.data); // success
        } catch (err) {
            if (err.response?.status === 404 && err.response.data) {
                setResult(err.response.data); // show message normally
            } else {
                setResult({ success: false, message: "Failed to fetch transaction status. Try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`max-w-3xl mx-auto p-6 rounded-xl shadow-md ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <h2 className="text-xl font-bold mb-4">{`Check Transaction Status`}</h2>

            <form onSubmit={handleCheckStatus} className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter custom_order_id"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900"
                        }`}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                    {loading ? "Checking..." : "Check"}
                </button>
            </form>

            {/* Show message whether success or "not found" */}
            {result && !result.data && (
                <p className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>{result.message}</p>
            )}

            {result && result.success && result.data && (
                <div className={`overflow-x-auto border rounded-lg shadow-sm mt-4 ${darkMode ? "border-gray-700" : "border-gray-300 "}`}>
                    <table className={`min-w-full border-collapse ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        <thead>
                            <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                                <th className="border p-2 text-left">Collect ID</th>
                                <th className="border p-2 text-left">School ID</th>
                                <th className="border p-2 text-left">Gateway</th>
                                <th className="border p-2 text-left">Order Amount</th>
                                <th className="border p-2 text-left">Transaction Amount</th>
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-left">Custom Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                                <td className="border p-2">{result.data.collect_id}</td>
                                <td className="border p-2">{result.data.school_id}</td>
                                <td className="border p-2">{result.data.gateway}</td>
                                <td className="border p-2">{result.data.order_amount}</td>
                                <td className="border p-2">{result.data.transaction_amount}</td>
                                <td className="border p-2">{result.data.status}</td>
                                <td className="border p-2">{result.data.custom_order_id}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransactionStatusCheck;
