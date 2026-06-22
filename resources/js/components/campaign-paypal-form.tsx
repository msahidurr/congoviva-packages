import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';

interface CampaignPayPalFormProps {
  campaignData: any;
  paypalClientId: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CampaignPayPalForm({ 
  campaignData,
  paypalClientId,
  currency,
  onSuccess, 
  onCancel 
}: CampaignPayPalFormProps) {
  const { t } = useTranslation();
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paypalClientId || !paypalRef.current) return;

    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=${currency.toUpperCase()}&disable-funding=credit,card`;
    script.async = true;
    
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: campaignData.final_amount?.toString() || campaignData.total_amount?.toString() || '0',
                  currency_code: currency.toUpperCase()
                },
                description: `Campaign: ${campaignData.name}`
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              // Send payment details to backend
              router.post(route('campaigns.paypal.payment'), {
                order_id: data.orderID,
                payment_id: details.id,
                campaign_data: campaignData,
                coupon_code: campaignData.coupon_code || '',
              }, {
                onSuccess: () => {
                  toast.success(t('Campaign created and payment processed successfully'));
                  onSuccess();
                },
                onError: () => {
                  toast.error(t('Payment failed'));
                }
              });
            });
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            if (err.message && err.message.includes('declined')) {
              toast.error(t('Card was declined. Please try a different payment method.'));
            } else {
              toast.error(t('Payment failed. Please try again.'));
            }
          },
          onCancel: () => {
            onCancel();
          }
        }).render(paypalRef.current);
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [paypalClientId, campaignData, currency]);

  if (!paypalClientId) {
    return <div className="p-4 text-center text-red-500">{t('PayPal not configured')}</div>;
  }

  return (
    <div className="space-y-4">
      <div ref={paypalRef}></div>
    </div>
  );
}

// Extend window object for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}