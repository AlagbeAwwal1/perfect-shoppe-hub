
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StoreSettings } from '@/types/settings';

interface ContactInfoCardProps {
  settings: StoreSettings;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactInfoCard = ({ settings, handleInputChange }: ContactInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Set your store's contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input 
              id="contactEmail" 
              name="contactEmail" 
              type="email"
              value={settings.contactEmail}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input 
              id="contactPhone" 
              name="contactPhone" 
              value={settings.contactPhone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              name="address" 
              value={settings.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
