
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/types/settings";

export async function getStoreSettingsFromDB(): Promise<StoreSettings | null> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching store settings:', error);
      throw error;
    }

    if (!data) {
      console.log('No store settings found in database');
      return null;
    }

    // Parse payment methods safely
    let paymentMethods = { paystack: false, bankTransfer: false };
    if (data.payment_methods) {
      try {
        const methods = typeof data.payment_methods === 'string' 
          ? JSON.parse(data.payment_methods) 
          : data.payment_methods;
          
        paymentMethods = {
          paystack: Boolean(methods.paystack),
          bankTransfer: Boolean(methods.bank_transfer || methods.bankTransfer)
        };
      } catch (e) {
        console.error('Error parsing payment methods:', e);
      }
    }

    // Transform the data to match our StoreSettings type
    const settings: StoreSettings = {
      id: data.id,
      storeName: data.store_name || '',
      currency: data.currency || 'NGN',
      taxRate: Number(data.tax_rate) || 0,
      paymentMethods,
      contactEmail: data.contact_email || '',
      contactPhone: data.contact_phone || '',
      address: data.address || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || ''
    };

    console.log('Fetched store settings:', settings);
    return settings;
  } catch (error) {
    console.error('Error in getStoreSettingsFromDB:', error);
    throw error;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  try {
    console.log('Updating store settings:', settings);
    
    // Transform settings to match the database schema
    const dbSettings: any = {
      store_name: settings.storeName,
      currency: settings.currency,
      tax_rate: settings.taxRate,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      address: settings.address,
      updated_at: new Date().toISOString()
    };
    
    // Handle payment methods properly
    if (settings.paymentMethods) {
      dbSettings.payment_methods = JSON.stringify({
        paystack: settings.paymentMethods.paystack,
        bank_transfer: settings.paymentMethods.bankTransfer
      });
    }

    // Remove undefined keys
    Object.keys(dbSettings).forEach(key => 
      dbSettings[key] === undefined && delete dbSettings[key]
    );

    console.log('Prepared settings for database:', dbSettings);

    // If we have a settings record, update it, otherwise insert a new one
    if (settings.id) {
      const { error } = await supabase
        .from('store_settings')
        .update(dbSettings)
        .eq('id', settings.id);

      if (error) {
        console.error('Error updating store settings:', error);
        throw error;
      }
      
      console.log('Updated existing settings with ID:', settings.id);
    } else {
      const { error } = await supabase
        .from('store_settings')
        .insert([dbSettings]);

      if (error) {
        console.error('Error creating store settings:', error);
        throw error;
      }
      
      console.log('Created new store settings');
    }
    
    console.log('Store settings updated successfully');
  } catch (error) {
    console.error('Error in updateStoreSettings:', error);
    throw error;
  }
}
