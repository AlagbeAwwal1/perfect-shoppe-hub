
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { StoreSettings } from '@/types/settings';

interface PaymentMethodsCardProps {
  settings: StoreSettings;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const PaymentMethodsCard = ({ settings, handleSwitchChange }: PaymentMethodsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Configure which payment methods your store accepts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="paystack">Paystack</Label>
            <p className="text-sm text-gray-500">Accept payments with Paystack</p>
          </div>
          <Switch 
            id="paystack"
            checked={settings.paymentMethods.paystack}
            onCheckedChange={(checked) => {
              console.log("Toggling paystack to:", checked);
              handleSwitchChange('paymentMethods.paystack', checked);
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="bankTransfer">Bank Transfer</Label>
            <p className="text-sm text-gray-500">Accept payments via bank transfer</p>
          </div>
          <Switch 
            id="bankTransfer"
            checked={settings.paymentMethods.bankTransfer}
            onCheckedChange={(checked) => {
              console.log("Toggling bank transfer to:", checked);
              handleSwitchChange('paymentMethods.bankTransfer', checked);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
