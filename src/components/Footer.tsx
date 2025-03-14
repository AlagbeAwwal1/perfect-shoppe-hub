
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-gradient-to-br from-brand-purple to-purple-700 text-white pt-14 pb-8 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="decorative-dot top-20 left-10 w-20 h-20 opacity-10" style={{ animationDelay: "0s" }}></div>
      <div className="decorative-dot bottom-20 left-1/4 w-16 h-16 opacity-10" style={{ animationDelay: "1s" }}></div>
      <div className="decorative-circle top-1/3 right-10 w-24 h-24 opacity-10" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4 text-white">
              <span className="relative">
                The Perfect Shoppe
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-brand-gold"></span>
              </span>
            </h3>
            <p className="text-gray-200 mb-6 leading-relaxed">
              Providing high-quality Islamic wear and accessories to enhance your spiritual journey with elegance and comfort.
            </p>
            <div className="flex space-x-5">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <a 
                    href="https://www.instagram.com/theperfectshoppe_?igsh=dDBoN3oxdGtibDJ0" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-brand-gold transform transition-all duration-300 hover:scale-110"
                  >
                    <Instagram size={22} className="hover-glow" />
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-brand-purple/90 border-brand-gold/20 text-white w-auto">
                  Follow us on Instagram
                </HoverCardContent>
              </HoverCard>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <a 
                    href="https://www.tiktok.com/@theperfectshoppe?_t=ZM-8udXUV1rD5J&_r=1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-brand-gold transform transition-all duration-300 hover:scale-110"
                  >
                    <FaTiktok size={20} className="hover-glow" />
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-brand-purple/90 border-brand-gold/20 text-white w-auto">
                  Follow us on TikTok
                </HoverCardContent>
              </HoverCard>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <a 
                    href="mailto:faosiatolamide2017@gmail.com" 
                    className="text-white hover:text-brand-gold transform transition-all duration-300 hover:scale-110"
                  >
                    <Mail size={22} className="hover-glow" />
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-brand-purple/90 border-brand-gold/20 text-white w-auto">
                  Email Us
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          
          <div className="md:col-span-3 md:col-start-6 animate-fade-in delay-100">
            <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-brand-gold"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/contact", label: "Contact" },
                ...(!isAuthenticated ? [{ to: "/login", label: "Login" }] : [])
              ].map((link, index) => (
                <li key={link.to} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                  <Link 
                    to={link.to} 
                    className="text-gray-200 hover:text-white transition-colors relative group"
                  >
                    <span>{link.label}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-4 md:col-start-9 animate-fade-in delay-200">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl p-6 hover-lift">
              <h3 className="text-xl font-bold mb-4 text-white relative inline-block">
                Contact Us
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-brand-gold"></span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="bg-brand-gold/20 p-2.5 rounded-full flex-shrink-0 group-hover:bg-brand-gold/30 transition-colors">
                    <MapPin size={18} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm">24, Babatunde Fadiya St., Akute, Ogun State</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="bg-brand-gold/20 p-2.5 rounded-full flex-shrink-0 group-hover:bg-brand-gold/30 transition-colors">
                    <Phone size={18} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm">+234 903 563 6061</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="bg-brand-gold/20 p-2.5 rounded-full flex-shrink-0 group-hover:bg-brand-gold/30 transition-colors">
                    <Mail size={18} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm">faosiatolamide2017@gmail.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-10 pt-6 text-center animate-fade-in delay-300">
          <Separator className="bg-white/20 mb-6" />
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} The Perfect Shoppe. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Wave decoration at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <div className="w-full h-16 bg-white/5"></div>
      </div>
    </footer>
  );
};

export default Footer;
