import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 px-8 flex justify-between items-center sticky top-0 z-50">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 tracking-tight transition-transform hover:scale-105"
        >
          Land Registry
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium text-base">
          <Link
            to="/"
            className="hover:text-blue-600 hover:underline transition"
          >
            Home
          </Link>

          <Link
            to="/lands"
            className="hover:text-blue-600 hover:underline transition"
          >
            Available Lands
          </Link>
          <Link
            to="/list-land"
            className="hover:text-blue-600 hover:underline transition"
          >
            List Your Land
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600 hover:underline transition"
          >
            About
          </Link>
        </nav>

        {/* Right: Profile/Login */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Login
          </Link>
          <Link
            to="/profile"
            className="text-sm text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Profile
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
