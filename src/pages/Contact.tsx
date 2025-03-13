
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Submitting form data:", formData);
      
      // Send email using the Supabase Edge Function with the correct headers
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log("Response from edge function:", { data, error });
      
      if (error) {
        console.error("Error invoking edge function:", error);
        throw new Error("Failed to send a request to the Edge Function");
      }
      
      if (!data || !data.success) {
        console.error("Function returned error:", data);
        throw new Error(data?.error || "Unknown error occurred");
      }
      
      // Show success toast
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-purple mb-4">Contact Us</h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-brand-purple mb-6">Send Us a Message</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    placeholder="Your email"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Message subject"
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Your message"
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-purple text-white hover:bg-brand-purple/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-sm h-full">
              <h2 className="text-2xl font-bold text-brand-purple mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-brand-purple/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">123 Islam Street, Lagos, Nigeria</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-purple/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">+234 123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-purple/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@theperfectshoppe.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-purple/10 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                    <p className="text-gray-600">Sunday: Closed</p>
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
