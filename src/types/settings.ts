
export interface StoreSettings {
  id: string;
  storeName: string;
  currency: string;
  taxRate: number;
  paymentMethods: {
    paystack: boolean;
    bankTransfer: boolean;
  };
  contactEmail: string;
  contactPhone: string;
  address: string;
  created_at: string;
  updated_at: string;
}
