// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-10 border-t border-gray-700">
      <p className="text-sm">
        © {new Date().getFullYear()} Secure Land Registry · Built with Blockchain & React
      </p>
    </footer>
  );
};

export default Footer;
