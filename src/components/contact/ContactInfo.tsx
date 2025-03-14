
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm h-full text-center">
      <h2 className="text-2xl font-bold text-brand-purple mb-6">Get in Touch</h2>
      
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="bg-brand-purple/10 p-3 rounded-full mb-3">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
            <p className="text-gray-600">24, Babatunde Fadiya St., Akute, Ogun State</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-brand-purple/10 p-3 rounded-full mb-3">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
            <p className="text-gray-600">+234 903 563 6061</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-brand-purple/10 p-3 rounded-full mb-3">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
            <p className="text-gray-600">faosiatolamide2017@gmail.com</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-brand-purple/10 p-3 rounded-full mb-3">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
            <p className="text-gray-600">Saturday: 10am - 4pm</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
