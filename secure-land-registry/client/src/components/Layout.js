import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 px-8 flex justify-between items-center">
        {/* Project Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 transition-transform hover:scale-105">
          Land Registry
        </Link>

        {/* Center Navigation Links */}
        <nav className="space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/lands" className="hover:underline">Available Lands</Link>
          <Link to="/list-land" className="hover:underline">List Your Land</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </nav>

        {/* Profile Link at Right */}
        <nav>
          <Link to="/profile" className="hover:underline text-gray-700 font-medium">Profile</Link>
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
