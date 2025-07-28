declare global {
  interface Window {
    OmiseCard: {
      configure: (config: { publicKey: string }) => void;
      open: (options: {
        amount: string;
        currency: string;
        defaultPaymentMethod: string;
        otherPaymentMethods: string[];
        onCreateTokenSuccess: (nonce: string) => void;
        onFormClosed?: () => void;
      }) => void;
      close: () => void;
    };
  }
}

export {};
