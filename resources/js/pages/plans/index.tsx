import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router, usePage } from '@inertiajs/react';
import { 
  CheckCircle2, 
  X, 
  Edit, 
  Trash2, 
  Globe, 
  FileText, 
  Bot, 
  BarChart2, 
  Mail, 
  Box, 
  Store, 
  Users, 
  HardDrive,
  Plus,
  Sparkles,
  Info,
  Crown,
  Zap,
  Clock,
  Banknote,
  CreditCard,
  IndianRupee,
  Wallet,
  Coins
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { useForm } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { PlanSubscriptionModal } from '@/components/plan-subscription-modal';

interface Plan {
  id: number;
  name: string;
  price: string | number;
  formatted_price?: string;
  duration: string;
  description: string;
  trial_days: number;
  features: string[];
  stats: {
    businesses: number | string;
    users: number | string;
    storage: string;
    templates: number | string;
    bio_links?: number;
    bio_links_templates?: number;
    addons?: number;
    addon_names?: string[];
    template_sections?: number;
  };
  status: boolean;
  recommended?: boolean;
  is_default?: boolean;
  is_current?: boolean;
  is_trial_available?: boolean;
  has_pending_request?: boolean;
  request_id?: number;
}

interface Props {
  plans: Plan[];
  billingCycle: 'monthly' | 'yearly';
  hasDefaultPlan?: boolean;
  isAdmin?: boolean;
  currentPlan?: any;
  userTrialUsed?: boolean;
  paymentMethods?: any[];
}

export default function Plans({ plans: initialPlans, billingCycle: initialBillingCycle = 'monthly', hasDefaultPlan, isAdmin = false, currentPlan, userTrialUsed, paymentMethods = [] }: Props) {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialBillingCycle);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const [processing, setProcessing] = useState<number | null>(null);
  
  // Helper function to safely format currency
    const formatCurrency = (amount: string | number) => {
    if (typeof window !== 'undefined' && window.appSettings?.formatCurrency) {
      // Use numeric value if available, otherwise parse the string
      const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
      return window.appSettings.formatCurrency(numericAmount, { showSymbol: true });
    }
    // Fallback if appSettings is not available
    return amount;
  };
  
  // Update plans when initialPlans changes
  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);
  
  // Show flash messages
  useEffect(() => {
    if (flash?.error) {
      toast.error(flash.error);
    }
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);
  
  // Function to handle billing cycle change
  const handleBillingCycleChange = (value: 'monthly' | 'yearly') => {
    setBillingCycle(value);
    router.get(route('plans.index'), { billing_cycle: value }, { preserveState: true });
  };
  
  // Company plan actions
  const handlePlanRequest = (planId: number) => {
    setProcessing(planId);
    router.post(route('plans.request'), {
      plan_id: planId,
      billing_cycle: billingCycle
    }, {
      onFinish: () => setProcessing(null)
    });
  };
  const handleCancelRequest = (requestId: number) => {
    router.post(route('plans.cancel-request'), 
      { request_id: requestId }
    );
  };
  const handleStartTrial = (planId: number) => {
    setProcessing(planId);
    router.post(route('plans.trial'), {
      plan_id: planId
    }, {
      onFinish: () => setProcessing(null)
    });
  };

  const handleSubscribe = async (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      try {
        const response = await fetch(route('payment.methods'));
        const paymentMethods = await response.json();
        setSelectedPlan({ ...plan, paymentMethods });
        setIsSubscriptionModalOpen(true);
      } catch (error) {
        toast.error(t('Failed to load payment methods'));
      }
    }
  };

  const formatPaymentMethods = (paymentSettings: any) => {
    const methods = [];
    
    if (paymentSettings?.is_manually_enabled === true || paymentSettings?.is_manually_enabled === '1') {
      methods.push({
        id: 'manually',
        name: t('Manual Payment'),
        icon: <Banknote className="h-5 w-5" />,
        enabled: true
      });
    }
        
    if (paymentSettings?.is_bank_enabled === true || paymentSettings?.is_bank_enabled === '1') {
      methods.push({
        id: 'bank',
        name: t('Bank Transfer'),
        icon: <Banknote className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_stripe_enabled === true || paymentSettings?.is_stripe_enabled === '1') {
      methods.push({
        id: 'stripe',
        name: t('Stripe'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_paypal_enabled === true || paymentSettings?.is_paypal_enabled === '1') {
      methods.push({
        id: 'paypal',
        name: t('PayPal'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_razorpay_enabled === true || paymentSettings?.is_razorpay_enabled === '1') {
      methods.push({
        id: 'razorpay',
        name: t('Razorpay'),
        icon: <IndianRupee className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if ((paymentSettings?.is_mercadopago_enabled === true || paymentSettings?.is_mercadopago_enabled === '1')) {
      methods.push({
        id: 'mercadopago',
        name: t('MercadoPago'),
        icon: <Wallet className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_paystack_enabled === true || paymentSettings?.is_paystack_enabled === '1') {
      methods.push({
        id: 'paystack',
        name: t('Paystack'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_flutterwave_enabled === true || paymentSettings?.is_flutterwave_enabled === '1') {
      methods.push({
        id: 'flutterwave',
        name: t('Flutterwave'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_paytabs_enabled === true || paymentSettings?.is_paytabs_enabled === '1') {
      methods.push({
        id: 'paytabs',
        name: t('PayTabs'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_skrill_enabled === true || paymentSettings?.is_skrill_enabled === '1') {
      methods.push({
        id: 'skrill',
        name: t('Skrill'),
        icon: <Wallet className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_coingate_enabled === true || paymentSettings?.is_coingate_enabled === '1') {
      methods.push({
        id: 'coingate',
        name: t('CoinGate'),
        icon: <Coins className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_payfast_enabled === true || paymentSettings?.is_payfast_enabled === '1') {
      methods.push({
        id: 'payfast',
        name: t('Payfast'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_tap_enabled === true || paymentSettings?.is_tap_enabled === '1') {
      methods.push({
        id: 'tap',
        name: t('Tap'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_xendit_enabled === true || paymentSettings?.is_xendit_enabled === '1') {
      methods.push({
        id: 'xendit',
        name: t('Xendit'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_paytr_enabled === true || paymentSettings?.is_paytr_enabled === '1') {
      methods.push({
        id: 'paytr',
        name: t('PayTR'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_mollie_enabled === true || paymentSettings?.is_mollie_enabled === '1') {
      methods.push({
        id: 'mollie',
        name: t('Mollie'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_toyyibpay_enabled === true || paymentSettings?.is_toyyibpay_enabled === '1') {
      methods.push({
        id: 'toyyibpay',
        name: t('toyyibPay'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_cashfree_enabled === true || paymentSettings?.is_cashfree_enabled === '1') {
      methods.push({
        id: 'cashfree',
        name: t('Cashfree'),
        icon: <IndianRupee className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_khalti_enabled === true || paymentSettings?.is_khalti_enabled === '1') {
      methods.push({
        id: 'khalti',
        name: t('Khalti'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
        
    if (paymentSettings?.is_iyzipay_enabled === true || paymentSettings?.is_iyzipay_enabled === '1') {
      methods.push({
        id: 'iyzipay',
        name: t('Iyzipay'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_benefit_enabled === true || paymentSettings?.is_benefit_enabled === '1') {
      methods.push({
        id: 'benefit',
        name: t('Benefit'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_ozow_enabled === true || paymentSettings?.is_ozow_enabled === '1') {
      methods.push({
        id: 'ozow',
        name: t('Ozow'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_easebuzz_enabled === true || paymentSettings?.is_easebuzz_enabled === '1') {
      methods.push({
        id: 'easebuzz',
        name: t('Easebuzz'),
        icon: <IndianRupee className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_authorizenet_enabled === true || paymentSettings?.is_authorizenet_enabled === '1') {
      methods.push({
        id: 'authorizenet',
        name: t('AuthorizeNet'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_fedapay_enabled === true || paymentSettings?.is_fedapay_enabled === '1') {
      methods.push({
        id: 'fedapay',
        name: t('FedaPay'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_payhere_enabled === true || paymentSettings?.is_payhere_enabled === '1') {
      methods.push({
        id: 'payhere',
        name: t('PayHere'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_cinetpay_enabled === true || paymentSettings?.is_cinetpay_enabled === '1') {
      methods.push({
        id: 'cinetpay',
        name: t('CinetPay'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_paiement_enabled === true || paymentSettings?.is_paiement_enabled === '1') {
      methods.push({
        id: 'paiement',
        name: t('Paiement Pro'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_nepalste_enabled === true || paymentSettings?.is_nepalste_enabled === '1') {
      methods.push({
        id: 'nepalste',
        name: t('Nepalste'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_yookassa_enabled === true || paymentSettings?.is_yookassa_enabled === '1') {
      methods.push({
        id: 'yookassa',
        name: t('YooKassa'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_aamarpay_enabled === true || paymentSettings?.is_aamarpay_enabled === '1') {
      methods.push({
        id: 'aamarpay',
        name: t('Aamarpay'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    if (paymentSettings?.is_midtrans_enabled === true || paymentSettings?.is_midtrans_enabled === '1') {
      methods.push({
        id: 'midtrans',
        name: t('Midtrans'),
        icon: <CreditCard className="h-5 w-5" />,
        enabled: true
      });
    }
    
    return methods;
  };
  
  const getActionButton = (plan: Plan) => {
    // Check if user has active subscription to this plan
    if (currentPlan && currentPlan.id === plan.id && currentPlan.expires_at && new Date(currentPlan.expires_at) > new Date()) {
      return (
        <Button disabled className="w-full bg-green-100 text-green-800 border-green-200">
          <Crown className="h-4 w-4 mr-2" />
          {t('Already Subscribed')}
        </Button>
      );
    }
    
    if (plan.is_current) {
      return (
        <Button disabled className="w-full">
          <Crown className="h-4 w-4 mr-2" />
          {t('Current Plan')}
        </Button>
      );
    }

    if (plan.is_trial_available && !userTrialUsed) {
      return (
        <div className="space-y-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleStartTrial(plan.id);
            }}
            disabled={processing === plan.id}
            variant="outline"
            className="w-full"
            type="button"
          >
            <Zap className="h-4 w-4 mr-2" />
            {t('Start {{days}} Day Trial', { days: plan.trial_days })}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSubscribe(plan.id);
            }}
            disabled={processing === plan.id}
            className="w-full"
            type="button"
          >
            {t('Subscribe Now')}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {plan.has_pending_request ? (
          <Button
            onClick={() => handleCancelRequest(plan.request_id!)}
            disabled={processing === plan.id}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            {t('Cancel Request')}
          </Button>
        ) : (
            <Button
              onClick={() => handlePlanRequest(plan.id)}
              disabled={processing === plan.id}
              variant="outline"
              className="w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              {t('Request Plan')}
            </Button>
        )}
        <Button
          onClick={() => handleSubscribe(plan.id)}
          disabled={processing === plan.id || (currentPlan && currentPlan.id === plan.id && currentPlan.expires_at && new Date(currentPlan.expires_at) > new Date())}
          className="w-full"
        >
          {currentPlan && currentPlan.id === plan.id && currentPlan.expires_at && new Date(currentPlan.expires_at) > new Date() 
            ? t('Already Subscribed') 
            : t('Subscribe Now')
          }
        </Button>
      </div>
    );
  };
  
  // Function to get the appropriate icon for a feature
  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Custom Domain':
        return <Globe className="h-4 w-4" />;
      case 'Subdomain':
        return <Globe className="h-4 w-4" />;
      case 'PWA':
        return <FileText className="h-4 w-4" />;
      case 'Blog Module':
        return <FileText className="h-4 w-4" />;
      case 'AI Integration':
        return <Bot className="h-4 w-4" />;
      case 'Analytics':
        return <BarChart2 className="h-4 w-4" />;
      case 'Email Support':
        return <Mail className="h-4 w-4" />;
      case 'API Access':
        return <Box className="h-4 w-4" />;
      case 'Priority Support':
        return <Users className="h-4 w-4" />;
      case 'Storage':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  // Function to check if a feature is included in the plan
  const isFeatureIncluded = (plan: Plan, featureKey: string) => {
    
    if (Array.isArray(plan.features)) {
      // For Template Sections, check stats instead
      if (featureKey === 'Template Sections') {
        return plan.stats.template_sections !== undefined && plan.stats.template_sections > 0;
      }
      if (featureKey === 'Bio Link') {
         return plan.features.some(feature => feature.startsWith('Bio Link'));
      }
      if (featureKey === 'vCard Builder') {
        return plan.features.some(feature => feature.startsWith('vCard Builder'));
      }
      return plan.features.includes(featureKey);
    }
    
    if (typeof plan.features === 'object' && plan.features !== null) {
      // Map display keys to actual feature keys
      const featureKeyMap: { [key: string]: string } = {
        'Custom CSS/JS': 'custom_css_js',
        'Broadcast Email': 'broadcast_email',
        'Custom Domain': 'custom_domain',
        'Subdomain': 'custom_subdomain',
        'PWA': 'pwa_support',
        'AI Integration': 'ai_integration',
        'Password Protection': 'password_protection',
        'Google Wallet': 'google_wallet',
        'Bio Link': 'bio_link',
        'vCard Builder': 'vcard_builder'
      };
      const actualKey = featureKeyMap[featureKey] || featureKey;
      return (plan.features as any)[actualKey] === true;
    }
    return false;
  };
  
  // Function to get template sections display text
  const getTemplateSectionsText = (plan: Plan) => {
    const count = plan.stats.template_sections || 0;
    return t('Template Sections') + ' (' + count + ')';
  };
  
  // Function to toggle plan status
  const togglePlanStatus = (planId: number) => {
    // Send request to toggle plan status
    router.post(route('plans.toggle-status', planId), {}, {
      preserveState: true,
      onSuccess: () => {
        // Update local state
        setPlans(plans.map(plan => 
          plan.id === planId ? { ...plan, status: !plan.status } : plan
        ));
      }
    });
  };
  
  // Function to handle delete
  const handleDelete = (plan: Plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };
  
  // Function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (planToDelete) {
      router.delete(route('plans.destroy', planToDelete.id), {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }
      });
    }
  };

  // Plan features to display - using actual backend feature names
  const planFeatures = [
    { key: 'Custom Domain', label: t('Custom Domain'), icon: <Globe className="h-4 w-4" /> },
    { key: 'Subdomain', label: t('Custom Subdomain'), icon: <Globe className="h-4 w-4" /> },
    { key: 'PWA', label: t('PWA Support'), icon: <FileText className="h-4 w-4" /> },
    { key: 'AI Integration', label: t('AI Integration'), icon: <Bot className="h-4 w-4" /> },
    { key: 'Password Protection', label: t('Password Protection'), icon: <CheckCircle2 className="h-4 w-4" /> },
    { key: 'Custom CSS/JS', label: t('Custom CSS/JS'), icon: <FileText className="h-4 w-4" /> },
    { key: 'Google Wallet', label: t('Google Wallet'), icon: <Wallet className="h-4 w-4" /> },
    { key: 'Bio Link', label: t('Bio Link'), icon: <Globe className="h-4 w-4" /> },
    { key: 'vCard Builder', label: t('vCard Builder'), icon: <FileText className="h-4 w-4" /> },
    { key: 'Broadcast Email', label: t('Broadcast Email'), icon: <Mail className="h-4 w-4" /> },
    { key: 'Template Sections', label: t('Template Sections'), icon: <FileText className="h-4 w-4" /> }
  ];

  // Define stat icons
  const statIcons = {
    businesses: <Store className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    storage: <HardDrive className="h-5 w-5" />,
    templates: <FileText className="h-5 w-5" />,
    bio_links: <Globe className="h-5 w-5" />,
    bio_links_templates: <FileText className="h-5 w-5" />
  };
  const breadcrumbs = [
      { title: t('Dashboard'), href: route('dashboard') },
      { title: t('Plans')},
      { title: t('Plan')},
    ];
  return (
    <PageTemplate 
      title={t('Plan')} 
      breadcrumbs={breadcrumbs}
      description={t("Manage subscription plans for your customers")}
      url="/plans"
    >
      <div className="space-y-8">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              {isAdmin ? t("Subscription Plans") : t("Choose Your Plan")}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {isAdmin 
                ? t("Create and manage subscription plans to offer different service tiers to your customers.") 
                : t("Select the perfect plan for your business needs")
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Tabs 
              value={billingCycle} 
              onValueChange={(v) => handleBillingCycleChange(v as 'monthly' | 'yearly')} 
              className="w-full sm:w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">{t("Monthly")}</TabsTrigger>
                <TabsTrigger value="yearly">
                  {t("Yearly")} 
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {isAdmin && (
              <Button className="w-full sm:w-auto" onClick={() => router.get(route('plans.create'))}>
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Plan")}
              </Button>
            )}
          </div>
        </div>
        
        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative h-full flex flex-col transition-all duration-300 ${
                isAdmin && !plan.status ? 'grayscale opacity-60' : ''
              }`}
            >
              {/* Main Card */}
              <div className={`
                relative h-full flex flex-col rounded-xl border-2 bg-card shadow-sm
                transition-all duration-300 hover:shadow-lg
                ${plan.recommended 
                  ? 'border-[3px] border-primary shadow-md' 
                  : (!isAdmin && plan.is_current ? 'border-primary shadow-md' : 'border-border')
                }
                ${isAdmin && !plan.status ? 'bg-muted/30' : ''}
              `}>
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground px-5 py-2 rounded-full shadow-md flex items-center gap-1.5 text-sm font-semibold">
                      <Sparkles className="h-4 w-4" />
                      {t("Recommended")}
                    </div>
                  </div>
                )}
                
                {/* Status Badges - Top Right */}
                <div className="absolute top-4 right-3 z-10 flex gap-1.5">
                  {isAdmin && (
                    <>
                      {plan.is_default && (
                        <div className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {t("Default")}
                        </div>
                      )}
                      <div className={`
                        px-2 py-0.5 rounded-md text-xs font-medium border
                        ${plan.status 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                        }
                      `}>
                        {plan.status ? t("Active") : t("Inactive")}
                      </div>
                    </>
                  )}
                  {!isAdmin && plan.is_current && (
                    <div className="px-4 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary border-2 border-primary/20 flex items-center gap-1.5">
                      <Crown className="h-4 w-4" />
                      {t("Current")}
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="flex flex-col h-full p-6">
                  {/* Header Section */}
                  <div className="text-center mb-6 pt-2">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className={`text-4xl font-extrabold ${
                        plan.recommended ? 'text-primary' : 'text-foreground'
                      }`}>
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">
                        /{t(plan.duration.toLowerCase())}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                    {plan.trial_days > 0 && (
                      <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Zap className="h-3 w-3" />
                        {t("{{days}} days free trial", { days: plan.trial_days })}
                      </div>
                    )}
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-border mb-5"></div>
                  
                  {/* Stats Section - Compact */}
                  <div className="mb-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{plan.stats.businesses}</div>
                        <div className="text-xs text-muted-foreground font-medium">{t("Businesses")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{plan.stats.users}</div>
                        <div className="text-xs text-muted-foreground font-medium">{t("Users")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{plan.stats.storage}</div>
                        <div className="text-xs text-muted-foreground font-medium">{t("Storage")}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center mt-3">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{plan.stats.templates}</div>
                        <div className="text-xs text-muted-foreground font-medium">{t("Templates")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{plan.stats.bio_links}</div>
                        <div className="text-xs text-muted-foreground font-medium">{t("Bio Links")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{plan.stats.bio_links_templates}</div>
                        <div className="text-xs text-muted-foreground font-medium">{t("Bio Themes")}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features Section */}
                  <div className="flex-1 mb-5">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {t("Features")}
                    </h4>
                    <ul className="space-y-2">
                      {planFeatures.map((feature, index) => {
                        const included = isFeatureIncluded(plan, feature.key);
                        return (
                          <li key={index} className="flex items-start gap-2.5">
                            {included ? (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm leading-tight ${
                              included ? 'text-foreground font-medium' : 'text-muted-foreground'
                            }`}>
                              {feature.key === 'Template Sections' ? getTemplateSectionsText(plan) : t(feature.label)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  {/* Addons Section */}
                  {plan.stats.addons > 0 && plan.stats.addon_names && plan.stats.addon_names.length > 0 && (
                    <div className="mb-5">
                      <div className="bg-muted/50 rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Box className="h-4 w-4 text-primary" />
                          <span className="text-xs font-semibold text-foreground">
                            {t("Included Addons")} ({plan.stats.addons})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.stats.addon_names?.map((name, index) => (
                            <span key={index} className="inline-block bg-background text-foreground px-2 py-1 rounded text-xs font-medium border border-border">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Section */}
                  <div className="mt-auto pt-5 border-t border-border">
                    {isAdmin ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={plan.status} 
                            onCheckedChange={() => togglePlanStatus(plan.id)}
                            className={plan.status ? "data-[state=checked]:bg-primary" : ""}
                          />
                          <span className="text-sm text-muted-foreground font-medium">
                            {plan.status ? t("Active") : t("Inactive")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title={t("Edit")}
                            onClick={() => router.get(route('plans.edit', plan.id))}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!plan.is_default && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title={t("Delete")}
                              onClick={() => handleDelete(plan)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      getActionButton(plan)
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Delete Modal - Admin only */}
        {isAdmin && (
          <CrudDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            itemName={planToDelete?.name || ''}
            entityName="plan"
          />
        )}
        
        {/* Subscription Modal - Company only */}
        {!isAdmin && selectedPlan && (
          <PlanSubscriptionModal
            isOpen={isSubscriptionModalOpen}
            onClose={() => {
              setIsSubscriptionModalOpen(false);
              setSelectedPlan(null);
            }}
            plan={selectedPlan}
            billingCycle={billingCycle}
            paymentMethods={formatPaymentMethods(selectedPlan.paymentMethods)}
          />
        )}
      </div>
    </PageTemplate>
  );
}
