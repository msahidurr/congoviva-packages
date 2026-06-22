import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HandCoins, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { PaymentFormData } from '@/utils/payment';
import { toast } from '@/components/custom-toast';

interface ManualPaymentFormProps {
  formData: PaymentFormData;
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
  processing?: boolean;
}

export function ManualPaymentForm({ formData, onSuccess, onError, processing = false }: ManualPaymentFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create manual payment order
      const routeUrl = typeof route !== 'undefined' ? route('manual.payment') : '/payments/manual';
      const requestData = {
        plan_id: formData.planId,
        billing_cycle: formData.billingCycle,
        coupon_code: formData.couponCode || null,
      };
      
      
      const response = await fetch(routeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        toast.success(data.message || t('Order created successfully'));
        onSuccess(data);
      } else {
        const errorMessage = data.message || data.errors?.subscription?.[0] || t('Failed to create manual payment order');
        console.error('Manual payment error:', errorMessage, data);
        onError(errorMessage);
      }
    } catch (error) {
      console.error('Manual payment error:', error);
      onError(t('An error occurred while processing your request'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">{t('Order Created Successfully')}</CardTitle>
          <CardDescription>
            {t('Your order has been created and is pending approval')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('Your order is now pending manual approval. You will receive an email confirmation once your payment has been verified and your subscription is activated.')}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button 
              onClick={() => window.location.href = route('dashboard')}
              className="w-full"
            >
              {t('Go to Dashboard')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <HandCoins className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>{t('Manual Payment')}</CardTitle>
        <CardDescription>
          {t('Submit your order for manual processing')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('By submitting this order, you agree to pay manually. Your subscription will be activated after payment verification by our team.')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">{t('Order Summary')}</h4>
            <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('Plan')}:</span>
                <span className="font-medium">Plan #{formData.planId}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('Billing Cycle')}:</span>
                <span className="font-medium capitalize">{formData.billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('Amount')}:</span>
                <span className="font-medium">{window.appSettings.formatCurrency(formData.planPrice)}</span>
              </div>
              {formData.couponCode && (
                <div className="flex justify-between">
                  <span>{t('Coupon')}:</span>
                  <span className="font-medium">{formData.couponCode}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">{t('Next Steps')}</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t('Submit your order using the button below')}</li>
              <li>{t('You will receive an email with payment instructions')}</li>
              <li>{t('Complete the payment using the provided details')}</li>
              <li>{t('Your subscription will be activated after verification')}</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={processing || isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            {(processing || isLoading) ? t('Processing...') : t('Submit Order')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}