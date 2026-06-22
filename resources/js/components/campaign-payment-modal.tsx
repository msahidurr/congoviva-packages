import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Banknote, Tag, Loader2, Calendar, DollarSign } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { CampaignStripeForm } from '@/components/campaign-stripe-form';
import { CampaignPayPalForm } from '@/components/campaign-paypal-form';
import { CampaignBankForm } from '@/components/campaign-bank-form';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface CampaignPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData?: {
    name: string;
    description?: string;
    business_id: string;
    start_date: string;
    end_date: string;
    total_days: number;
    total_amount: number;
  } | null;
  paymentMethods: PaymentMethod[];
  paymentSettings?: any;
  campaignSettings?: any;
  categories?: any[];
  businesses?: any[];
}

export function CampaignPaymentModal({ 
  isOpen, 
  onClose, 
  campaignData, 
  paymentMethods,
  paymentSettings = {},
  campaignSettings = null,
  categories = [],
  businesses = []
}: CampaignPaymentModalProps) {
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [showPayPalForm, setShowPayPalForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  // Check if ChatGPT modal is open
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);
  
  useEffect(() => {
    const checkChatGpt = () => {
      const chatGptModal = document.querySelector('[data-chatgpt-modal]') || 
                          document.querySelector('.chatgpt-modal') ||
                          document.querySelector('[class*="chatgpt"]') ||
                          document.querySelector('[id*="chatgpt"]');
      setIsChatGptOpen(!!chatGptModal);
    };
    
    const observer = new MutationObserver(checkChatGpt);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);
  
  const { data, setData, post, processing } = useForm({
    name: '',
    description: '',
    business_id: '',
    start_date: '',
    end_date: '',
    payment_method: '',
    coupon_code: '',
  });

  // Calculate price per day based on campaign settings pricing tiers
  const calculatePricePerDay = (totalDays: number) => {
    if (!campaignSettings?.pricing_tiers || campaignSettings.pricing_tiers.length === 0) {
      return 10.00; // Default price per day
    }
    
    for (const tier of campaignSettings.pricing_tiers) {
      if (totalDays >= tier.min_days && totalDays <= tier.max_days) {
        return parseFloat(tier.per_day_price);
      }
    }
    
    // Fallback to the last tier if no match found
    const lastTier = campaignSettings.pricing_tiers[campaignSettings.pricing_tiers.length - 1];
    return parseFloat(lastTier?.per_day_price || 10.00);
  };

  // Calculate total days and amount when dates change
  useEffect(() => {
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (endDate < startDate) {
        setTotalDays(0);
        setTotalAmount(0);
        setFinalAmount(0);
        return;
      }
      
      const diffTime = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const costPerDay = calculatePricePerDay(days);
      const amount = days * costPerDay;
      
      setTotalDays(days);
      setTotalAmount(amount);
      setFinalAmount(Math.max(0, amount - discountAmount));
    }
  }, [data.start_date, data.end_date, discountAmount, campaignSettings]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t('Please enter a coupon code'));
      return;
    }
    
    setCouponLoading(true);
    try {
      const response = await fetch(route('coupons.validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          amount: totalAmount
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        const discount = data.coupon.type === 'percentage' 
          ? (totalAmount * data.coupon.value) / 100
          : data.coupon.value;
        setDiscountAmount(Math.min(discount, totalAmount));
        setAppliedCoupon(data.coupon);
        toast.success(t('Coupon applied successfully'));
      } else {
        toast.error(data.message || t('Invalid coupon code'));
        setDiscountAmount(0);
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error(t('Failed to validate coupon'));
      setDiscountAmount(0);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      toast.error(t('Please select a payment method'));
      return;
    }

    if (selectedPaymentMethod === 'stripe') {
      setShowStripeForm(true);
      return;
    }

    if (selectedPaymentMethod === 'paypal') {
      setShowPayPalForm(true);
      return;
    }

    if (selectedPaymentMethod === 'bank') {
      setShowBankForm(true);
      return;
    }

    // For manual payment method, submit directly
    const submitData = {
      ...data,
      payment_method: selectedPaymentMethod,
      coupon_code: appliedCoupon?.code || couponCode,
      final_amount: finalAmount,
    };

    post(route('campaigns.store'), submitData, {
      onSuccess: () => {
        toast.success(t('Campaign created successfully'));
        onClose();
      },
      onError: (errors) => {
        toast.error(t('Failed to create campaign: {{error}}', { 
          error: Object.values(errors).join(', ') 
        }));
      }
    });
  };

  const handlePaymentSuccess = () => {
    toast.success(t('Campaign created and payment processed successfully'));
    onClose();
  };

  const enabledPaymentMethods = paymentMethods.filter(method => method.enabled);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!isChatGptOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('Complete Campaign Payment')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Campaign Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('Campaign Name')}</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder={t('Enter campaign name')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('Description')}</Label>
              <Input
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder={t('Enter description (optional)')}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">              
              <div className="space-y-2">
                <Label htmlFor="business">{t('Business')}</Label>
                <Select
                  value={data.business_id}
                  onValueChange={(value) => setData('business_id', value)}
                >
                  <SelectTrigger id="business">
                    <SelectValue placeholder={t('Select Business')} />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map((business: any) => (
                      <SelectItem key={business.id} value={String(business.id)}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">{t('Start Date')}</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="cursor-pointer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">{t('End Date')}</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Campaign Summary */}
          {totalDays > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-medium">{t('Campaign Summary')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{totalDays} {t('days')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{window.appSettings.formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  {discountAmount > 0 && (
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('Subtotal')}</span>
                        <span>{window.appSettings.formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{t('Discount')}</span>
                        <span>-{window.appSettings.formatCurrency(discountAmount)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>{t('Total')}</span>
                        <span>{window.appSettings.formatCurrency(finalAmount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coupon Code */}
          <div className="space-y-3">
            <Label htmlFor="coupon">{t('Coupon Code')} ({t('Optional')})</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t('Enter coupon code')}
                  className="pr-10"
                  disabled={!!appliedCoupon}
                />
                <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {!appliedCoupon ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || couponLoading}
                >
                  {couponLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('Apply')
                  )}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleRemoveCoupon}
                >
                  {t('Remove')}
                </Button>
              )}
            </div>
            
            {appliedCoupon && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700 font-medium">
                    {t('Coupon Applied')}: {appliedCoupon.code}
                  </span>
                  <span className="text-green-600">
                    -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `${window?.appSettings?.currencySettings?.currencySymbol || '$'}${appliedCoupon.value}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>{t('Select Payment Method')}</Label>
            {enabledPaymentMethods.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('No payment methods available')}
              </p>
            ) : (
              <div className="space-y-2">
                {enabledPaymentMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">{method.icon}</div>
                        <span className="font-medium">{method.name}</span>
                        {selectedPaymentMethod === method.id && (
                          <Badge variant="secondary" className="ml-auto">
                            {t('Selected')}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Stripe Payment Form */}
          {showStripeForm && selectedPaymentMethod === 'stripe' && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">{t('Enter Card Details')}</h3>
              <CampaignStripeForm
                campaignData={{
                  ...data,
                  coupon_code: appliedCoupon?.code || couponCode,
                  final_amount: finalAmount
                }}
                stripeKey={paymentSettings?.stripe_key || ''}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowStripeForm(false)}
              />
            </div>
          )}

          {/* PayPal Payment Form */}
          {showPayPalForm && selectedPaymentMethod === 'paypal' && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">{t('PayPal Payment')}</h3>
              <CampaignPayPalForm
                campaignData={{
                  ...data,
                  coupon_code: appliedCoupon?.code || couponCode,
                  final_amount: finalAmount
                }}
                paypalClientId={paymentSettings?.paypal_client_id || ''}
                currency={paymentSettings?.default_currency || 'usd'}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayPalForm(false)}
              />
            </div>
          )}

          {/* Bank Transfer Form */}
          {showBankForm && selectedPaymentMethod === 'bank' && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">{t('Bank Transfer')}</h3>
              <CampaignBankForm
                campaignData={{
                  ...data,
                  coupon_code: appliedCoupon?.code || couponCode,
                  final_amount: finalAmount
                }}
                bankDetails={paymentSettings?.bank_details || ''}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowBankForm(false)}
              />
            </div>
          )}

          {/* Actions */}
          {!showStripeForm && !showPayPalForm && !showBankForm && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                {t('Cancel')}
              </Button>
              <Button 
                onClick={handlePayNow} 
                disabled={processing || enabledPaymentMethods.length === 0}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('Processing...')}
                  </>
                ) : (
                  `${t('Pay')} ${window.appSettings.formatCurrency(finalAmount)}`
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
