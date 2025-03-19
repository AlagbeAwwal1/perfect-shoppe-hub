
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StoreSettings } from '@/types/settings';

interface GeneralSettingsCardProps {
  settings: StoreSettings;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralSettingsCard = ({ settings, handleInputChange }: GeneralSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure your store's basic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input 
              id="storeName" 
              name="storeName" 
              value={settings.storeName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input 
              id="currency" 
              name="currency" 
              value={settings.currency}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input 
              id="taxRate" 
              name="taxRate" 
              type="number"
              min="0"
              step="0.01"
              value={settings.taxRate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsCard;
