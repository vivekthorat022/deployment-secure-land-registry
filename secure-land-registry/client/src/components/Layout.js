import { Link } from "react-router-dom";
import Footer from "../components/Footer"; // ✅ Import the new Footer

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Land Registry</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/list-land" className="hover:underline">List Land</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/admin/users" className="hover:underline">Admin</Link>
        </nav>
      </header>

      <main className="flex-grow p-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
