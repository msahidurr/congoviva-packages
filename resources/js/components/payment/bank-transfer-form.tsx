import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { Copy, CheckCircle } from 'lucide-react';

interface BankTransferFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  bankDetails: string;
  currencies?: any[];
  currencySettings?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BankTransferForm({ 
  planId, 
  planPrice,
  couponCode, 
  billingCycle, 
  bankDetails,
  currencies = [],
  currencySettings = {},
  onSuccess, 
  onCancel 
}: BankTransferFormProps) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [finalPrice, setFinalPrice] = useState(planPrice);

  // The final price should already be calculated and passed from parent
  useEffect(() => {
    setFinalPrice(planPrice);
  }, [planPrice]);

  const handleCopyLink = (text: string) => {
    // Fallback clipboard function for HTTP environments
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API for HTTPS
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((resolve, reject) => {
          if (document.execCommand('copy')) {
            textArea.remove();
            resolve();
          } else {
            textArea.remove();
            reject(new Error('Copy failed'));
          }
        });
      }
    };
    copyToClipboard(text)
      .then(() => {
        toast.success(t('Amount copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy amount'));
      });
  };

  const formatDisplayPrice = (amount: number): string => {
    try {
      const settings = {
        defaultCurrency: currencySettings?.defaultCurrency || 'USD',
        decimalFormat: currencySettings?.decimalFormat || '2',
        decimalSeparator: currencySettings?.decimalSeparator || '.',
        thousandsSeparator: currencySettings?.thousandsSeparator || ',',
        floatNumber: currencySettings?.floatNumber !== false,
        currencySymbolSpace: currencySettings?.currencySymbolSpace === true,
        currencySymbolPosition: currencySettings?.currencySymbolPosition || 'before',
      };

      let formattedAmount = Number(amount) || 0;
      if (!settings.floatNumber) {
        formattedAmount = Math.floor(formattedAmount);
      }

      const decimalPlaces = parseInt(settings.decimalFormat) || 2;
      let formattedNumber: string;
      
      if (settings.decimalFormat === '0') {
        formattedNumber = Math.floor(formattedAmount).toString() + settings.decimalSeparator + '00';
      } else {
        const fixedNumber = Number(formattedAmount).toFixed(decimalPlaces);
        const parts = fixedNumber.split('.');
        
        if (settings.thousandsSeparator !== 'none' && settings.thousandsSeparator) {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousandsSeparator);
        }
        
        formattedNumber = parts.join(settings.decimalSeparator);
      }

      let symbol = '$';
      if (currencies && currencies.length > 0) {
        const selectedCurrency = currencies.find((c: any) => c.code === settings.defaultCurrency);
        if (selectedCurrency) {
          symbol = selectedCurrency.symbol;
        }
      } else if (window?.appSettings?.currencySettings?.currencySymbol) {
        symbol = window.appSettings.currencySettings.currencySymbol;
      }

      const space = settings.currencySymbolSpace ? ' ' : '';
      if (settings.currencySymbolPosition === 'before') {
        return `${symbol}${space}${formattedNumber}`;
      } else {
        return `${formattedNumber}${space}${symbol}`;
      }
    } catch (error) {
      return `$${amount}`;
    }
  };

  const handleConfirmPayment = () => {
    setProcessing(true);
    
    router.post(route('bank.payment'), {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode,
      amount: finalPrice,
    }, {
      onSuccess: () => {
        //toast.success(t('Payment request submitted successfully'));
        onSuccess();
      },
      onError: () => {
        toast.error(t('Failed to submit payment request'));
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t('Bank Transfer Details')}</h3>
          <div className="space-y-3 text-sm">
            <div className="whitespace-pre-line">{bankDetails}</div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{t('Amount')}: {formatDisplayPrice(finalPrice)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(formatDisplayPrice(finalPrice))}
              >
                <Copy className="h-3 w-3 mr-1" />
                {t('Copy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">{t('Important Instructions')}</p>
              <ul className="space-y-1 text-xs">
                <li>• {t('Transfer the exact amount shown above')}</li>
                <li>• {t('Include your order reference in the transfer description')}</li>
                <li>• {t('Your plan will be activated after payment verification')}</li>
                <li>• {t('Verification may take 1-3 business days')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('Cancel')}
        </Button>
        <Button 
          onClick={handleConfirmPayment} 
          disabled={processing}
          className="flex-1"
        >
          {processing ? t('Processing...') : t('I have made the payment')}
        </Button>
      </div>
    </div>
  );
}