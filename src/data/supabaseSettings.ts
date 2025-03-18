
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/types/settings";

export async function getStoreSettingsFromDB(): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching store settings:', error);
    throw error;
  }

  if (!data) return null;

  // Transform the data to match our StoreSettings type
  const settings: StoreSettings = {
    id: data.id,
    storeName: data.store_name,
    currency: data.currency,
    taxRate: data.tax_rate,
    paymentMethods: {
      paystack: data.payment_methods ? 
        (typeof data.payment_methods === 'object' && 'paystack' in data.payment_methods ? 
          !!data.payment_methods.paystack : false) : false,
      bankTransfer: data.payment_methods ? 
        (typeof data.payment_methods === 'object' && 'bank_transfer' in data.payment_methods ? 
          !!data.payment_methods.bank_transfer : false) : false,
    },
    contactEmail: data.contact_email || '',
    contactPhone: data.contact_phone || '',
    address: data.address || '',
    created_at: data.created_at,
    updated_at: data.updated_at
  };

  return settings;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  // Transform settings to match the database schema
  const dbSettings: any = {
    store_name: settings.storeName,
    currency: settings.currency,
    tax_rate: settings.taxRate,
    payment_methods: settings.paymentMethods ? {
      paystack: settings.paymentMethods.paystack,
      bank_transfer: settings.paymentMethods.bankTransfer
    } : undefined,
    contact_email: settings.contactEmail,
    contact_phone: settings.contactPhone,
    address: settings.address,
    updated_at: new Date().toISOString()
  };

  // Remove undefined keys
  Object.keys(dbSettings).forEach(key => 
    dbSettings[key] === undefined && delete dbSettings[key]
  );

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
  } else {
    const { error } = await supabase
      .from('store_settings')
      .insert([dbSettings]);

    if (error) {
      console.error('Error creating store settings:', error);
      throw error;
    }
  }
}
