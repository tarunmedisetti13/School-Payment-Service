import { useState } from "react";
import api from "../api/api";

export default function CreatePayment() {
    const [form, setForm] = useState({
        school_id: "",
        trustee_id: "",
        amount: "",
        student_name: "",
        student_id: "",
        student_email: "",
        gateway_name: "PhonePe",
        callback_url: "",
    });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                school_id: form.school_id,
                trustee_id: form.trustee_id,
                amount: Number(form.amount),
                student_info: {
                    name: form.student_name,
                    id: form.student_id,
                    email: form.student_email,
                },
                gateway_name: form.gateway_name,
                callback_url: form.callback_url,
            };

            const res = await api.post("/payments/create", payload);

            if (res.data.success) {
                setResponse(res.data);

                // Open payment URL in a new tab immediately
                window.open(res.data.data.collect_request_url, "_blank");
            } else {
                setError("Failed to create payment. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Create Payment</h2>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center w-full">
                <input
                    type="text"
                    placeholder="School ID"
                    name="school_id"
                    value={form.school_id}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Trustee ID"
                    name="trustee_id"
                    value={form.trustee_id}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Student Name"
                    name="student_name"
                    value={form.student_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Student ID"
                    name="student_id"
                    value={form.student_id}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Student Email"
                    name="student_email"
                    value={form.student_email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Callback URL"
                    name="callback_url"
                    value={form.callback_url}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <select
                    name="gateway_name"
                    value={form.gateway_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="GooglePay">Google Pay</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500"
                >
                    {loading ? "Creating..." : "Create Payment"}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {response && (
                <div className="mt-4 p-4 border rounded bg-green-50">
                    <h3 className="font-bold">Payment Created!</h3>
                    <p>Order ID: {response.orderId}</p>
                    <p>Please complete the payment in the newly opened tab.</p>
                </div>
            )}
        </div>
    );
}
