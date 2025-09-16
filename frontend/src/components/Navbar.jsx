import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed w-full justify-evenly bg-blue-600 p-4 text-white flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/create-payment">Create Payment</Link>
            <Link to="/status">Payment Status</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/summary">Summary</Link>
            <Link to="/webhooks">Webhooks</Link>
        </nav>
    );
}
