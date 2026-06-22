export interface PaymentFormData {
  planId: number;
  planPrice: number;
  billingCycle: 'monthly' | 'yearly';
  couponCode?: string;
  currencies?: any[];
  currencySettings?: any;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  order_id?: string;
  amount?: number;
  status?: string;
}

export const formatCurrency = (amount: number, currency = 'USD', settings?: any, currencies?: any[]): string => {
  if (settings && currencies) {
    try {
      const currencySettings = {
        defaultCurrency: settings.defaultCurrency || currency,
        decimalFormat: settings.decimalFormat || '2',
        decimalSeparator: settings.decimalSeparator || '.',
        thousandsSeparator: settings.thousandsSeparator || ',',
        floatNumber: settings.floatNumber !== false,
        currencySymbolSpace: settings.currencySymbolSpace === true,
        currencySymbolPosition: settings.currencySymbolPosition || 'before',
      };

      let formattedAmount = Number(amount) || 0;
      if (!currencySettings.floatNumber) {
        formattedAmount = Math.floor(formattedAmount);
      }

      const decimalPlaces = parseInt(currencySettings.decimalFormat) || 2;
      let formattedNumber: string;
      
      if (currencySettings.decimalFormat === '0') {
        formattedNumber = Math.floor(formattedAmount).toString() + currencySettings.decimalSeparator + '00';
      } else {
        const fixedNumber = Number(formattedAmount).toFixed(decimalPlaces);
        const parts = fixedNumber.split('.');
        
        if (currencySettings.thousandsSeparator !== 'none' && currencySettings.thousandsSeparator) {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currencySettings.thousandsSeparator);
        }
        
        formattedNumber = parts.join(currencySettings.decimalSeparator);
      }

      let symbol = '$';
      if (currencies && currencies.length > 0) {
        const selectedCurrency = currencies.find((c: any) => c.code === currencySettings.defaultCurrency);
        if (selectedCurrency) {
          symbol = selectedCurrency.symbol;
        }
      }

      const space = currencySettings.currencySymbolSpace ? ' ' : '';
      if (currencySettings.currencySymbolPosition === 'before') {
        return `${symbol}${space}${formattedNumber}`;
      } else {
        return `${formattedNumber}${space}${symbol}`;
      }
    } catch (error) {
      return `$${amount}`;
    }
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const isFreePlan = (price: number): boolean => {
  return price <= 0;
};

export const PAYMENT_METHODS = {
  MANUAL: 'manually',
  BANK: 'bank',
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  RAZORPAY: 'razorpay',
  MERCADOPAGO: 'mercadopago',
  PAYSTACK: 'paystack',
  FLUTTERWAVE: 'flutterwave',
  PAYTABS: 'paytabs',
  SKRILL: 'skrill',
  COINGATE: 'coingate',
  PAYFAST: 'payfast',
  TAP: 'tap',
  XENDIT: 'xendit',
  PAYTR: 'paytr',
  MOLLIE: 'mollie',
  TOYYIBPAY: 'toyyibpay',
  BENEFIT: 'benefit',
  IYZIPAY: 'iyzipay',
  AAMARPAY: 'aamarpay',
  MIDTRANS: 'midtrans',
  YOOKASSA: 'yookassa',
  NEPALSTE: 'nepalste',
  PAIEMENT: 'paiement',
  CINETPAY: 'cinetpay',
  PAYHERE: 'payhere',
  FEDAPAY: 'fedapay',
  AUTHORIZENET: 'authorizenet',
  KHALTI: 'khalti',
  EASEBUZZ: 'easebuzz',
  OZOW: 'ozow',
  CASHFREE: 'cashfree',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.MANUAL]: 'Manual Payment',
  [PAYMENT_METHODS.BANK]: 'Bank Transfer',
  [PAYMENT_METHODS.STRIPE]: 'Stripe',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.RAZORPAY]: 'Razorpay',
  [PAYMENT_METHODS.MERCADOPAGO]: 'Mercado Pago',
  [PAYMENT_METHODS.PAYSTACK]: 'Paystack',
  [PAYMENT_METHODS.FLUTTERWAVE]: 'Flutterwave',
  [PAYMENT_METHODS.PAYTABS]: 'PayTabs',
  [PAYMENT_METHODS.SKRILL]: 'Skrill',
  [PAYMENT_METHODS.COINGATE]: 'CoinGate',
  [PAYMENT_METHODS.PAYFAST]: 'Payfast',
  [PAYMENT_METHODS.TAP]: 'Tap',
  [PAYMENT_METHODS.XENDIT]: 'Xendit',
  [PAYMENT_METHODS.PAYTR]: 'PayTR',
  [PAYMENT_METHODS.MOLLIE]: 'Mollie',
  [PAYMENT_METHODS.TOYYIBPAY]: 'toyyibPay',
  [PAYMENT_METHODS.BENEFIT]: 'Benefit',
  [PAYMENT_METHODS.IYZIPAY]: 'Iyzipay',
  [PAYMENT_METHODS.AAMARPAY]: 'Aamarpay',
  [PAYMENT_METHODS.MIDTRANS]: 'Midtrans',
  [PAYMENT_METHODS.YOOKASSA]: 'YooKassa',
  [PAYMENT_METHODS.NEPALSTE]: 'Nepalste',
  [PAYMENT_METHODS.PAIEMENT]: 'Paiement Pro',
  [PAYMENT_METHODS.CINETPAY]: 'CinetPay',
  [PAYMENT_METHODS.PAYHERE]: 'PayHere',
  [PAYMENT_METHODS.FEDAPAY]: 'FedaPay',
  [PAYMENT_METHODS.AUTHORIZENET]: 'AuthorizeNet',
  [PAYMENT_METHODS.KHALTI]: 'Khalti',
  [PAYMENT_METHODS.EASEBUZZ]: 'Easebuzz',
  [PAYMENT_METHODS.OZOW]: 'Ozow',
  [PAYMENT_METHODS.CASHFREE]: 'Cashfree',
};

export const PAYMENT_METHOD_HELP_URLS = {
  [PAYMENT_METHODS.STRIPE]: 'https://dashboard.stripe.com/apikeys',
  [PAYMENT_METHODS.PAYPAL]: 'https://developer.paypal.com/developer/applications/',
  [PAYMENT_METHODS.RAZORPAY]: 'https://dashboard.razorpay.com/app/keys',
  [PAYMENT_METHODS.MERCADOPAGO]: 'https://www.mercadopago.com/developers/panel/credentials',
  [PAYMENT_METHODS.PAYSTACK]: 'https://dashboard.paystack.com/#/settings/developer',
  [PAYMENT_METHODS.FLUTTERWAVE]: 'https://dashboard.flutterwave.com/settings/apis',
  [PAYMENT_METHODS.PAYTABS]: 'https://www.paytabs.com/en/merchant-dashboard/',
  [PAYMENT_METHODS.SKRILL]: 'https://www.skrill.com/en/business/integration/',
  [PAYMENT_METHODS.COINGATE]: 'https://coingate.com/account/developer',
  [PAYMENT_METHODS.PAYFAST]: 'https://www.payfast.co.za/integration/shopping-carts/',
  [PAYMENT_METHODS.TAP]: 'https://www.tap.company/developers/',
  [PAYMENT_METHODS.XENDIT]: 'https://dashboard.xendit.co/settings/developers#api-keys',
  [PAYMENT_METHODS.PAYTR]: 'https://www.paytr.com/magaza/api-entegrasyonu',
  [PAYMENT_METHODS.MOLLIE]: 'https://www.mollie.com/dashboard/developers/api-keys',
  [PAYMENT_METHODS.TOYYIBPAY]: 'https://toyyibpay.com/',
  [PAYMENT_METHODS.BENEFIT]: 'https://www.benefit.bh/',
  [PAYMENT_METHODS.IYZIPAY]: 'https://merchant.iyzipay.com/',
  [PAYMENT_METHODS.AAMARPAY]: 'https://aamarpay.com/',
  [PAYMENT_METHODS.MIDTRANS]: 'https://dashboard.midtrans.com/',
  [PAYMENT_METHODS.YOOKASSA]: 'https://yookassa.ru/',
  [PAYMENT_METHODS.NEPALSTE]: 'https://nepalste.com.np/',
  [PAYMENT_METHODS.PAIEMENT]: 'https://paiement.pro/',
  [PAYMENT_METHODS.CINETPAY]: 'https://cinetpay.com/',
  [PAYMENT_METHODS.PAYHERE]: 'https://www.payhere.lk/',
  [PAYMENT_METHODS.FEDAPAY]: 'https://fedapay.com/',
  [PAYMENT_METHODS.AUTHORIZENET]: 'https://account.authorize.net/',
  [PAYMENT_METHODS.KHALTI]: 'https://khalti.com/',
  [PAYMENT_METHODS.EASEBUZZ]: 'https://www.easebuzz.in/',
  [PAYMENT_METHODS.OZOW]: 'https://www.ozow.com/',
  [PAYMENT_METHODS.CASHFREE]: 'https://www.cashfree.com/',
};
