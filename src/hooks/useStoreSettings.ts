
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { StoreSettings } from '@/types/settings';
import { getStoreSettingsFromDB, updateStoreSettings } from '@/data/supabaseSettings';

export const useStoreSettings = (isAdmin: boolean, userId: string | undefined) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Default settings if none are found
  const defaultSettings: StoreSettings = {
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

  const fetchSettings = async () => {
    if (!isAdmin || !userId) {
      setSettings(defaultSettings);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await getStoreSettingsFromDB();
      console.log('Fetched settings in hook:', data);
      
      // If no settings are returned, use the default settings
      setSettings(data || defaultSettings);
    } catch (error) {
      console.error('Error fetching store settings:', error);
      // Set default settings in case of an error
      setSettings(defaultSettings);
      toast({
        title: 'Error',
        description: 'Failed to load store settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [isAdmin, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    console.log(`Input change: ${name} = ${value} (${type})`);
    
    setSettings(prev => {
      if (!prev) return defaultSettings;
      
      if (type === 'number') {
        return {
          ...prev,
          [name]: parseFloat(value) || 0
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    console.log(`Switch change: ${name} = ${checked}`);
    
    setSettings(prev => {
      if (!prev) return defaultSettings;
      
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

  const saveSettings = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      console.log('Submitting settings:', settings);
      await updateStoreSettings(settings);
      toast({
        title: 'Success',
        description: 'Store settings updated successfully',
      });
      
      // Refresh settings after update
      await fetchSettings();
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

  return {
    settings: settings || defaultSettings,
    isLoading,
    isSaving,
    handleInputChange,
    handleSwitchChange,
    saveSettings
  };
};
