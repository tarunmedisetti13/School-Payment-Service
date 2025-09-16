// src/components/Transactions.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // URL query params (persist filters/sorting)
    const [searchParams, setSearchParams] = useSearchParams();

    // Extract filters from URL or defaults
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "";
    const schoolId = searchParams.get("schoolId") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);

                const res = await axios.get("http://localhost:5000/api/payments/transactions", {
                    params: { page, limit, status, schoolId, sortBy, order },
                });

                setTransactions(res.data.data);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [page, limit, status, schoolId, sortBy, order]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", newPage);
        setSearchParams(newParams);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Transactions Overview</h2>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                {/* Status Filter */}
                <select
                    value={status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                </select>

                {/* School Filter */}
                <input
                    type="text"
                    placeholder="School ID"
                    value={schoolId}
                    onChange={(e) => handleFilterChange("schoolId", e.target.value)}
                    className="border p-2 rounded"
                />

                {/* Sorting */}
                <select
                    value={sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="createdAt">Created At</option>
                    <option value="order_amount">Order Amount</option>
                    <option value="transaction_amount">Transaction Amount</option>
                </select>

                <select
                    value={order}
                    onChange={(e) => handleFilterChange("order", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
            <select
                value={limit}
                onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set("limit", e.target.value);
                    newParams.set("page", 1); // reset to first page
                    setSearchParams(newParams); // this will trigger useEffect and reload data
                }}
                className="border px-2 py-1 rounded mb-2"
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            {/* Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Collect ID</th>
                            <th className="border p-2">School ID</th>
                            <th className="border p-2">Gateway</th>
                            <th className="border p-2">Order Amount</th>
                            <th className="border p-2">Transaction Amount</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Custom Order ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn._id} className="hover:bg-gray-300">
                                <td className="border p-2">{txn.collect_id}</td>
                                <td className="border p-2">{txn.school_id}</td>
                                <td className="border p-2">{txn.gateway}</td>
                                <td className="border p-2">{txn.order_amount}</td>
                                <td className="border p-2">{txn.transaction_amount}</td>
                                <td className="border p-2">{txn.status}</td>
                                <td className="border p-2">{txn.custom_order_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="fixed bottom-0 w-fit h-20 flex justify-between items-center ">
                <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className=" bg-gray-200 rounded disabled:opacity-50 px-3 py-2 cursor-pointer hover:bg-gray-300"
                >
                    Prev
                </button>

                <span>
                    Page {page} of {Math.ceil(total / limit) || 1}
                </span>

                <button
                    disabled={page >= Math.ceil(total / limit)}
                    onClick={() => handlePageChange(page + 1)}
                    className=" bg-gray-200 rounded disabled:opacity-50 px-3 py-2 cursor-pointer hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Transactions;
