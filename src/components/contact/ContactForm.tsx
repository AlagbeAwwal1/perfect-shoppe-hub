
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
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
      // Validate form data before submitting
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill out all required fields");
      }
      
      console.log("Submitting form data:", formData);
      
      // Send email using the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      
      console.log("Response from edge function:", { data, error });
      
      if (error) {
        console.error("Error invoking edge function:", error);
        throw new Error(error.message || "Failed to send message");
      }
      
      if (!data || data.success === false) {
        console.error("Function returned error:", data);
        throw new Error(data?.error || "Failed to send message");
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
        description: error.message || "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-brand-purple mb-6">Send Us a Message</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
          <Input
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
          <Input
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
        <Input
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
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
          placeholder="Your message"
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-brand-purple text-white hover:bg-brand-purple/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
