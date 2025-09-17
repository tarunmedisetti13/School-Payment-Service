import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Transactions = () => {
    const { darkMode, api } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // URL query params
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "";
    const schoolId = searchParams.get("schoolId") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const date = searchParams.get("date") || "";

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await api.get("/payments/transactions", {
                    params: { page, limit, status, schoolId, sortBy, order, date },
                });
                setTransactions(res.data?.data || []);
                setTotal(res.data?.total || 0);
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setTransactions([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [page, limit, status, schoolId, sortBy, order, date]);

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(key, value);
        else newParams.delete(key);
        newParams.set("page", 1);
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", newPage);
        setSearchParams(newParams);
    };

    // 🎨 Shared style helpers (from TransactionsBySchool)
    const containerClasses = `p-6 max-w-6xl mx-auto min-h-full transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`;

    const inputClasses = `border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${darkMode
            ? "bg-gray-800 text-gray-100 border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`;

    const selectClasses = `border p-2 rounded cursor-pointer transition-colors duration-300 ${darkMode
            ? "bg-gray-800 text-gray-100 border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`;

    const tableClasses = `w-full border-collapse transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`;

    const headerClasses = `border p-3 font-medium transition-colors duration-300 ${darkMode
            ? "bg-gray-700 text-gray-100 border-gray-600"
            : "bg-gray-100 text-gray-900 border-gray-300"
        }`;

    const cellClasses = `border p-3 transition-colors duration-300 ${darkMode ? "border-gray-600 text-gray-100" : "border-gray-300 text-gray-900"
        }`;

    const getRowClasses = (index) =>
        `transition-colors duration-300 ${darkMode
            ? `${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`
            : `${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`
        }`;

    const getStatusBadge = (status) => {
        let badgeClasses = "px-2 py-1 rounded-full text-xs font-medium ";
        if (status === "SUCCESS") {
            badgeClasses += darkMode
                ? "bg-green-900 text-green-200"
                : "bg-green-100 text-green-800";
        } else if (status === "PENDING") {
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

    const getButtonClasses = (disabled) =>
        `px-4 py-2 rounded-lg border transition-colors duration-300 ${disabled
            ? darkMode
                ? "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
            : darkMode
                ? "bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-600 cursor-pointer"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300 cursor-pointer"
        }`;

    return (
        <div className={containerClasses}>
            <h2 className="text-xl font-bold mb-4">Transactions Overview</h2>

            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
                <select
                    value={status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className={selectClasses}
                >
                    <option value="">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                </select>

                <input
                    type="text"
                    placeholder="School ID"
                    value={schoolId}
                    onChange={(e) => handleFilterChange("schoolId", e.target.value)}
                    className={inputClasses}
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className={inputClasses}
                />

                <select
                    value={sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className={selectClasses}
                >
                    <option value="createdAt">Created At</option>
                    <option value="order_amount">Order Amount</option>
                    <option value="transaction_amount">Transaction Amount</option>
                </select>

                <select
                    value={order}
                    onChange={(e) => handleFilterChange("order", e.target.value)}
                    className={selectClasses}
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>

                <select
                    value={limit}
                    onChange={(e) => handleFilterChange("limit", e.target.value)}
                    className={selectClasses}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>

            {/* Loader */}
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <div className="flex items-center gap-2">
                        <div
                            className={`animate-spin rounded-full h-6 w-6 border-b-2 ${darkMode ? "border-gray-400" : "border-gray-600"
                                }`}
                        ></div>
                        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
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
                                <th className={headerClasses}>School ID</th>
                                <th className={headerClasses}>Gateway</th>
                                <th className={headerClasses}>Order Amount</th>
                                <th className={headerClasses}>Transaction Amount</th>
                                <th className={headerClasses}>Status</th>
                                <th className={headerClasses}>Custom Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => (
                                <tr key={txn._id} className={getRowClasses(index)}>
                                    <td className={cellClasses}>{txn.collect_id}</td>
                                    <td className={cellClasses}>{txn.school_id}</td>
                                    <td className={cellClasses}>{txn.gateway}</td>
                                    <td className={cellClasses}>₹{txn.order_amount}</td>
                                    <td className={cellClasses}>₹{txn.transaction_amount}</td>
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

            {/* Empty State */}
            {!loading && transactions.length === 0 && (
                <div
                    className={`text-center p-8 rounded-lg border transition-colors duration-300 ${darkMode
                            ? "bg-gray-800 border-gray-700 text-gray-400"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                >
                    <p>No transactions found</p>
                </div>
            )}

            {/* Pagination */}
            {transactions.length > 0 && total > limit && (
                <div className="flex justify-center items-center mt-6 gap-3">
                    <button
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                        className={getButtonClasses(page <= 1)}
                    >
                        Prev
                    </button>

                    <span
                        className={`px-3 py-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                    >
                        Page {page} of {Math.ceil(total / limit) || 1}
                    </span>

                    <button
                        disabled={page >= Math.ceil(total / limit)}
                        onClick={() => handlePageChange(page + 1)}
                        className={getButtonClasses(page >= Math.ceil(total / limit))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Transactions;
