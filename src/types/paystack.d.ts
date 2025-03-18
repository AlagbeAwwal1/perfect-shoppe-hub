
interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: any;
  callback?: (response: { reference: string }) => void;
  onClose?: () => void;
}

interface PaystackPop {
  setup(options: PaystackOptions): {
    openIframe: () => void;
  };
}

interface Window {
  PaystackPop: PaystackPop;
}
