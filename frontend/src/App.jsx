import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePayment from "./pages/CreatePayment";
import PaymentStatus from "./pages/PaymentStatus";
import Transactions from "./pages/Transactions";
import Summary from "./pages/Summary";
import WebhookLogs from "./pages/WebhookLogs";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4 pt-16 justify-center items-center">
        <Routes>
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
