
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-brand-purple text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">The Perfect Shoppe</h3>
            <p className="text-gray-200 mb-4">
              Providing high-quality Islamic wear and accessories to enhance your spiritual journey with elegance and comfort.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/theperfectshoppe_?igsh=dDBoN3oxdGtibDJ0" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@theperfectshoppe?_t=ZM-8udXUV1rD5J&_r=1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                <FaTiktok size={18} />
              </a>
              <a href="mailto:info@theperfectshoppe.com" className="text-white hover:text-brand-gold transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-200 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-200 hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-white transition-colors">Contact</Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link to="/login" className="text-gray-200 hover:text-white transition-colors">Login</Link>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-brand-gold flex-shrink-0 mt-1" />
                <p className="text-gray-200">24, Babatunde Fadiya Akute Ogun State</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-brand-gold flex-shrink-0" />
                <p className="text-gray-200">+2349035636061</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-brand-gold flex-shrink-0" />
                <p className="text-gray-200">info@theperfectshoppe.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} The Perfect Shoppe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
