import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ListYourLand from "./pages/ListYourLand";
import AdminApproval from "./pages/AdminApproval";
import ListOfLands from "./pages/ListOfLands";
import LandDetails from "./pages/LandDetails";
import LandInquiryPage from "./pages/LandInquiryPage";
import ChatPage from "./pages/ChatPage";
import TransactionHistory from "./pages/TransactionHistory";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TestTransactionPage from "./pages/TestTransactionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/list-land" element={<ListYourLand />} />
        <Route path="/admin/land-approval" element={<AdminApproval />} />
        <Route path="/lands" element={<ListOfLands />} />
        <Route path="/land/:id" element={<LandDetails />} />
        <Route path="/land/:id/inquire" element={<LandInquiryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test-transaction" element={<TestTransactionPage />} />

        {/* ✅ WILDCARD MUST BE LAST */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4caf50',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#f44336',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
