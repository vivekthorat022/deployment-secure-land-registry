// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-7 mt-10 border-t border-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* About Section */}
        <div>
          <h4 className="text-blue-400 font-semibold text-base mb-2">Secure Land Registry</h4>
          <p className="text-gray-400 leading-relaxed">
            A transparent and blockchain-backed solution for secure land ownership and transfer. Built for trust.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-blue-400 font-semibold text-base mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:underline hover:text-white">About</Link></li>
            <li><Link to="/lands" className="hover:underline hover:text-white">Available Lands</Link></li>
            <li><Link to="/list-land" className="hover:underline hover:text-white">List Your Land</Link></li>
          </ul>
        </div>

        {/* Contact / Credits */}
        <div>
          <h4 className="text-blue-400 font-semibold text-base mb-2">Connect</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://github.com/vivekthorat022/deployment-secure-land-registry"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline"
              >
                GitHub Repository
              </a>
            </li>
            <li className="text-gray-400">
              Built with Passion using React, Node.js, MongoDB & Solidity
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-gray-500 text-xs mt-10 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} Secure Land Registry · All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
