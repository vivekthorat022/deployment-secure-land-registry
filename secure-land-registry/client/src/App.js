import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ListYourLand from "./pages/ListYourLand";
import AdminApproval from "./pages/AdminApproval";
import ListOfLands from "./pages/ListOfLands";
import LandDetails from "./pages/LandDetails";
import LandInquiryPage from "./pages/LandInquiryPage";
import ChatPage from "./pages/ChatPage";
import TransactionHistory from "./pages/TransactionHistory";

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
        <Route path="/land/:id" element={<LandInquiryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/transactions" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
