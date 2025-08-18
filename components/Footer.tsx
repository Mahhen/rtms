"use client";

import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-12 border-t">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">RailBuddy</h3>
          <p className="text-gray-600">
            Your trusted partner for comfortable and reliable railway journeys across the country.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Info</h4>
          <ul className="space-y-2 text-gray-600">
            <li>📞 +91 98765 43210</li>
            <li>📧 support@railbuddy.com</li>
            <li>📍 123 Railway St, City</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Follow Us</h4>
          <div className="flex gap-4 text-gray-600">
            <a href="#"><Facebook /></a>
            <a href="#"><Twitter /></a>
            <a href="#"><Instagram /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} RailBuddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
