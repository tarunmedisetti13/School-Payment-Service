import { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const TransactionsBySchool = () => {
    const { darkMode, api } = useAuth(); // ✅ dark/light mode
    const [schoolId, setSchoolId] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [error, setError] = useState("");
    const [searchSchoolId, setSearchSchoolId] = useState("")
    const fetchTransactions = async (pageParam = page, id = searchSchoolId) => {
        if (!id.trim()) {
            setError("Please enter School ID");
            setTransactions([]);
            return;
        }
        setError("");

        try {
            setLoading(true);
            const res = await api.get(
                `/payments/transactions-school/${id}`,
                { params: { page: pageParam, limit, sortBy, order } }
            );

            if (res.data.data.length === 0) {
                setError("No transactions found for this School ID");
            }

            setTransactions(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            if (err.response) {
                // Backend responded with error
                if (err.response.status === 400) {
                    setError("Invalid School ID. Please check and try again.");
                } else if (err.response.status === 404) {
                    setError("School ID not found.");
                } else {
                    setError(err.response.data?.message || "Failed to fetch transactions");
                }
            } else {
                // Network or other issue
                setError("Network error. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };



    // Theme classes
    const containerClasses = `p-6 max-w-5xl mx-auto min-h-full transition-colors duration-300 ${darkMode
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900"
        }`;

    const inputClasses = `border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${darkMode
        ? "bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500"
        : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
        }`;

    const selectClasses = `border p-2 rounded cursor-pointer transition-colors duration-300 ${darkMode
        ? "bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500"
        : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
        }`;

    const tableClasses = `w-full border-collapse transition-colors duration-300 ${darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-300"
        }`;

    const headerClasses = `border p-3 font-medium transition-colors duration-300 ${darkMode
        ? "bg-gray-700 text-gray-100 border-gray-600"
        : "bg-gray-100 text-gray-900 border-gray-300"
        }`;

    const cellClasses = `border p-3 transition-colors duration-300 ${darkMode
        ? "border-gray-600 text-gray-100"
        : "border-gray-300 text-gray-900"
        }`;

    const getRowClasses = (index) => `transition-colors duration-300 ${darkMode
        ? `${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700`
        : `${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`
        }`;

    const getStatusBadge = (status) => {
        let badgeClasses = "px-2 py-1 rounded-full text-xs font-medium ";

        if (status === 'SUCCESS') {
            badgeClasses += darkMode
                ? "bg-green-900 text-green-200"
                : "bg-green-100 text-green-800";
        } else if (status === 'PENDING') {
            badgeClasses += darkMode
                ? "bg-yellow-900 text-yellow-200"
                : "bg-yellow-100 text-yellow-800";
        } else {
            badgeClasses += darkMode
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-800";
        }

        return badgeClasses;
    };

    const getButtonClasses = (disabled) => `px-4 py-2 rounded-lg border transition-colors duration-300 ${disabled
        ? darkMode
            ? "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
        : darkMode
            ? "bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-600 cursor-pointer"
            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300 cursor-pointer"
        }`;

    return (
        <div className={containerClasses}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                Transactions by School
            </h2>

            {/* Search Bar */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Enter School ID"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className={inputClasses}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setPage(1);
                            setSearchSchoolId(schoolId);
                            fetchTransactions(1, schoolId);  // ✅ pass input value
                        }
                    }}

                />

                <button

                    // On Search button
                    onClick={() => {
                        setPage(1);
                        setSearchSchoolId(schoolId);
                        fetchTransactions(1, schoolId);  // ✅ pass input value
                    }}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
                >
                    <FaSearch /> Search
                </button>

            </div>

            {/* Error Message */}
            {error && (
                <div className={`p-3 mb-4 rounded-lg border transition-colors duration-300 ${darkMode
                    ? "bg-red-900/20 border-red-800 text-red-200"
                    : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                    {error}
                </div>
            )}

            {/* Sorting & Limit */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={selectClasses}
                >
                    <option value="createdAt">Created At</option>
                    <option value="order_amount">Order Amount</option>
                    <option value="transaction_amount">Transaction Amount</option>
                </select>

                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className={selectClasses}
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>

                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className={selectClasses}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <div className="flex items-center gap-2">
                        <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${darkMode ? "border-gray-400" : "border-gray-600"
                            }`}></div>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Loading...
                        </p>
                    </div>
                </div>
            )}

            {/* Table */}
            {!loading && transactions.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-lg mb-6">
                    <table className={tableClasses}>
                        <thead>
                            <tr>
                                <th className={headerClasses}>Collect ID</th>
                                <th className={headerClasses}>Gateway</th>
                                <th className={headerClasses}>Order Amount</th>
                                <th className={headerClasses}>Transaction Amount</th>
                                <th className={headerClasses}>Status</th>
                                <th className={headerClasses}>Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => (
                                <tr key={txn._id} className={getRowClasses(index)}>
                                    <td className={cellClasses}>{txn.collect_id}</td>
                                    <td className={cellClasses}>{txn.gateway}</td>
                                    <td className={cellClasses}>
                                        <span className="font-medium">₹{txn.order_amount}</span>
                                    </td>
                                    <td className={cellClasses}>
                                        <span className="font-medium">₹{txn.transaction_amount}</span>
                                    </td>
                                    <td className={cellClasses}>
                                        <span className={getStatusBadge(txn.status)}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className={cellClasses}>{txn.custom_order_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* No Results Message */}
            {!loading && transactions.length === 0 && searchSchoolId && !error && (
                <div className={`text-center p-8 rounded-lg border transition-colors duration-300 ${darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}>
                    <p>No transactions found for School ID: {searchSchoolId}</p>
                </div>
            )}

            {/* Pagination */}
            {transactions.length > 0 && total > limit && (
                <div className="flex justify-center items-center mt-6 gap-3">
                    <button
                        disabled={page <= 1}
                        onClick={() => {
                            const newPage = page - 1;
                            setPage(newPage);
                            fetchTransactions(newPage);
                        }}
                        className={getButtonClasses(page <= 1)}
                    >
                        Prev
                    </button>

                    <span className={`px-3 py-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Page {page} of {Math.ceil(total / limit) || 1}
                    </span>

                    <button
                        disabled={page >= Math.ceil(total / limit)}
                        onClick={() => {
                            const newPage = page + 1;
                            setPage(newPage);
                            fetchTransactions(newPage);
                        }}
                        className={getButtonClasses(page >= Math.ceil(total / limit))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionsBySchool;