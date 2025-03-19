
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import GeneralSettingsCard from '@/components/admin/settings/GeneralSettingsCard';
import PaymentMethodsCard from '@/components/admin/settings/PaymentMethodsCard';
import ContactInfoCard from '@/components/admin/settings/ContactInfoCard';

const StoreSettings = () => {
  const { user, isAdmin } = useAuth();
  
  const {
    settings,
    isLoading,
    isSaving,
    handleInputChange,
    handleSwitchChange,
    saveSettings
  } = useStoreSettings(isAdmin, user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Store Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <GeneralSettingsCard 
            settings={settings}
            handleInputChange={handleInputChange}
          />
          
          <PaymentMethodsCard 
            settings={settings}
            handleSwitchChange={handleSwitchChange}
          />
          
          <ContactInfoCard 
            settings={settings}
            handleInputChange={handleInputChange}
          />
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
