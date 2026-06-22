import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, CreditCard, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Plan {
  id: number;
  name: string;
  monthly_price?: string | number;
  yearly_price?: string | number;
  price?: string | number;
  duration?: string;
  description?: string;
  features?: string[];
  business?: number;
  max_users?: number;
  storage_limit?: string;
  is_active?: boolean;
  is_current?: boolean;
  is_default?: boolean;
  [key: string]: any;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: number, duration: string) => void;
  plans: Plan[];
  currentPlanId?: number;
  companyName: string;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  onConfirm,
  plans,
  currentPlanId,
  companyName
}: UpgradePlanModalProps) {
  const { t } = useTranslation();
  const page = usePage<any>();
  const auth = page.props?.auth;
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Get currency settings
  const superadminSettings = auth?.superadminSettings || {};
  const globalSettings = auth?.globalSettings || {};
  const systemSettings = (page.props as any)?.systemSettings || {};
  const settings = { ...globalSettings, ...systemSettings, ...superadminSettings };
  const decimalPlaces = parseInt(settings.decimalFormat || '2');
  const decimalSeparator = settings.decimalSeparator || '.';
  const thousandsSeparator = settings.thousandsSeparator || ',';
  const currencySymbolSpace = settings.currencySymbolSpace === '1' || settings.currencySymbolSpace === 'true' || settings.currencySymbolSpace === true;
  const currencySymbolPosition = settings.currencySymbolPosition || 'before';
  const symbol = settings.currencySymbol || '$';
  const space = currencySymbolSpace ? ' ' : '';

  // Format currency helper function
  const formatCurrency = (amount: number | string): string => {
    // Try to use global appSettings helper if available
    if (typeof window !== 'undefined' && window.appSettings?.formatCurrency) {
      return window.appSettings.formatCurrency(amount);
    }

    const num = Number(amount) || 0;
    const parts = Number(num).toFixed(decimalPlaces).split('.');

    if (thousandsSeparator !== 'none') {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    }

    const formattedNumber = parts.join(decimalSeparator);

    return currencySymbolPosition === 'before'
      ? `${symbol}${space}${formattedNumber}`
      : `${formattedNumber}${space}${symbol}`;
  };

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

  // Filter plans based on billing cycle and duration field
  const filteredPlans = plans.filter(plan => {
    const planDuration = String(plan.duration || '').toLowerCase();

    if (billingCycle === 'yearly') {
      return planDuration === 'yearly';
    } else {
      return planDuration === 'monthly';
    }
  });

  // Initialize with current plan ID when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (!plans || plans.length === 0) {
      return;
    }

    // Find the current plan
    const currentPlan = plans.find(plan => plan.is_current === true);

    // If there's a current plan, select it and set the correct billing cycle
    if (currentPlan) {
      setSelectedPlanId(currentPlan.id);
      const detectedCycle = currentPlan.duration === 'yearly' ? 'yearly' : 'monthly';
      setBillingCycle(detectedCycle);
    } else if (currentPlanId) {
      setSelectedPlanId(currentPlanId);
      setBillingCycle('monthly');
    } else {
      setSelectedPlanId(plans[0].id);
      setBillingCycle('monthly');
    }
  }, [isOpen, plans, currentPlanId]);

  // Reset selected plan when billing cycle changes
  useEffect(() => {
    if (!isOpen || !filteredPlans.length) return;

    // Check if current selected plan exists in filtered plans
    const selectedPlanExists = filteredPlans.find(plan => plan.id === selectedPlanId);

    if (!selectedPlanExists) {
      // Find current plan in filtered plans or select first one
      const currentPlan = filteredPlans.find(plan => plan.is_current === true);
      setSelectedPlanId(currentPlan ? currentPlan.id : filteredPlans[0].id);
    }
  }, [billingCycle, filteredPlans, isOpen, selectedPlanId]);

  const getPriceForSelectedCycle = (plan: Plan) => {
    let price: any = null;

    if (billingCycle === 'yearly' && plan.yearly_price) {
      price = plan.yearly_price;
    } else if (billingCycle === 'monthly' && plan.monthly_price) {
      price = plan.monthly_price;
    } else if (plan.price) {
      price = plan.price;
    }

    if (price) {
      const numericPrice = parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
      return isNaN(numericPrice) ? price : formatCurrency(numericPrice);
    }

    return formatCurrency(0);
  };

  const getDurationLabel = () => {
    return billingCycle === 'yearly' ? t('Yearly') : t('Monthly');
  };

  const handleConfirm = () => {
    if (selectedPlanId) {
      onConfirm(selectedPlanId, billingCycle);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!isChatGptOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("Upgrade Plan for")} {companyName}</DialogTitle>
          <DialogDescription>
            {t("Select a new plan for this company")}
          </DialogDescription>
        </DialogHeader>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-3 py-4 border-b">
          <Label className="text-sm font-medium">{t('Monthly')}</Label>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <Label className="text-sm font-medium">{t('Yearly')}</Label>
        </div>

        <div className="py-4 flex-1 overflow-y-auto -mx-6 px-6">
          {filteredPlans && filteredPlans.length > 0 ? (
            <RadioGroup
              value={selectedPlanId?.toString() || ""}
              onValueChange={(value) => setSelectedPlanId(parseInt(value))}
              className="space-y-4"
            >
              <div className="space-y-4">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative flex items-center space-x-3 rounded-lg border p-4 ${selectedPlanId === plan.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                      } ${plan.is_current ? 'bg-blue-50' : ''}`}
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value={plan.id.toString()}
                        id={`plan-${plan.id}`}
                        className="h-5 w-5"
                      />
                      {selectedPlanId === plan.id && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
                        </div>
                      )}
                    </div>
                    <Label
                      htmlFor={`plan-${plan.id}`}
                      className="flex flex-1 cursor-pointer items-center justify-between"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center">
                          <p className="text-base font-medium">{plan.name}</p>
                          {plan.is_current && (
                            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                              {t("Current")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="mr-1.5 h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            {getPriceForSelectedCycle(plan)} / {getDurationLabel().toLowerCase()}
                          </p>
                          {billingCycle === 'yearly' && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-orange-100 text-orange-800">
                              {t('Best Value')}
                            </Badge>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        )}
                        {plan.features && plan.features.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {plan.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-muted-foreground">
                                <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                                {feature}
                              </div>
                            ))}
                            {plan.features.length > 3 && (
                              <div className="text-xs text-gray-400">+{plan.features.length - 3} more</div>
                            )}
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('No plans available for')} {getDurationLabel().toLowerCase()} {t('billing')}</p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPlanId}
          >
            {t("Upgrade Plan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}