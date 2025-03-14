
import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-12 page-container">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-brand-purple mb-4">Contact Us</h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in delay-200">
            Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="relative">
          <div className="decorative-dot top-0 left-10 w-16 h-16 opacity-30" style={{ animationDelay: "0.5s" }}></div>
          <div className="decorative-dot bottom-20 right-10 w-12 h-12 opacity-20" style={{ animationDelay: "1.2s" }}></div>
          <div className="decorative-circle top-40 right-20 w-24 h-24 opacity-20" style={{ animationDelay: "0.8s" }}></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
          <div className="lg:col-span-2 animate-slide-in-left">
            <div className="card-animated">
              <ContactForm />
            </div>
          </div>
          
          <div className="lg:col-span-1 animate-slide-in-right">
            <div className="card-animated bg-gradient-to-br from-brand-purple/5 to-brand-gold/5">
              <ContactInfo />
              
              {/* Additional animated contact info icons */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-brand-purple/10 transition-colors animate-fade-in delay-300">
                  <div className="bg-brand-purple/10 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Call Us</p>
                    <p className="text-gray-600">+234 123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-brand-purple/10 transition-colors animate-fade-in delay-400">
                  <div className="bg-brand-purple/10 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Email Us</p>
                    <p className="text-gray-600">info@theperfectshoppe.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-brand-purple/10 transition-colors animate-fade-in delay-500">
                  <div className="bg-brand-purple/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Visit Us</p>
                    <p className="text-gray-600">123 Fashion Street, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
