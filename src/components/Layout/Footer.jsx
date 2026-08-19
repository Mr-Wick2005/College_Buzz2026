import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">College Buzz</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting students across India with exciting college events, workshops, and opportunities.
              Join the buzz and never miss out on campus life!
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/veda_222005/" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium">
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/vedanth-gali-00683328b/" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium">
                LinkedIn
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#events" className="text-gray-300 hover:text-white transition-colors duration-200">Events</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="/student-auth" className="text-gray-300 hover:text-white transition-colors duration-200">Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">vedantmgali@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">+91 9987602631</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 College Buzz. All rights reserved. Made for students across India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
