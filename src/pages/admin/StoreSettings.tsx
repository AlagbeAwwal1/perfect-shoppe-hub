
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getStoreSettingsFromDB, updateStoreSettings } from '@/data/supabaseSettings';
import { StoreSettings as StoreSettingsType } from '@/types/settings';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const StoreSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettingsType | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getStoreSettingsFromDB();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching store settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load store settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setSettings(prev => prev ? ({
        ...prev,
        [name]: parseFloat(value)
      }) : null);
    } else {
      setSettings(prev => prev ? ({
        ...prev,
        [name]: value
      }) : null);
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => {
      if (!prev) return null;
      
      if (name.startsWith('paymentMethods.')) {
        const methodName = name.split('.')[1] as 'paystack' | 'bankTransfer';
        return {
          ...prev,
          paymentMethods: {
            ...prev.paymentMethods,
            [methodName]: checked
          }
        };
      }
      
      return {
        ...prev,
        [name]: checked
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setIsSaving(true);
    try {
      await updateStoreSettings(settings);
      toast({
        title: 'Success',
        description: 'Store settings updated successfully',
      });
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update store settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultSettings: StoreSettingsType = settings || {
    id: '',
    storeName: 'Hidaaya Store',
    currency: 'NGN',
    taxRate: 0,
    paymentMethods: {
      paystack: true,
      bankTransfer: false,
    },
    contactEmail: '',
    contactPhone: '',
    address: '',
    created_at: '',
    updated_at: '',
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Store Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
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
                    value={defaultSettings.storeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input 
                    id="currency" 
                    name="currency" 
                    value={defaultSettings.currency}
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
                    value={defaultSettings.taxRate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                  checked={defaultSettings.paymentMethods.paystack}
                  onCheckedChange={(checked) => handleSwitchChange('paymentMethods.paystack', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bankTransfer">Bank Transfer</Label>
                  <p className="text-sm text-gray-500">Accept payments via bank transfer</p>
                </div>
                <Switch 
                  id="bankTransfer"
                  checked={defaultSettings.paymentMethods.bankTransfer}
                  onCheckedChange={(checked) => handleSwitchChange('paymentMethods.bankTransfer', checked)}
                />
              </div>
            </CardContent>
          </Card>
          
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
                    value={defaultSettings.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input 
                    id="contactPhone" 
                    name="contactPhone" 
                    value={defaultSettings.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={defaultSettings.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;
