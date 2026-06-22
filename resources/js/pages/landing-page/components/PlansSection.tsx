import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, CheckCircle2, X, Globe, FileText, Bot, Mail, Box, Wallet, Zap } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

// Simple encryption function for plan ID
const encryptPlanId = (planId: number): string => {
  const key = 'vCard2025';
  const str = planId.toString();
  let encrypted = '';
  for (let i = 0; i < str.length; i++) {
    encrypted += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted);
};

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  yearly_price?: number;
  duration: string;
  trial_days?: number;
  features?: string[];
  is_popular?: boolean;
  is_plan_enable: string;
  stats?: {
    businesses?: number | string;
    users?: number | string;
    storage?: string;
    templates?: number | string;
    bio_links?: number | string;
    bio_links_templates?: number | string;
    addons?: number;
    addon_names?: string[];
  };
}

interface PlansSectionProps {
  brandColor?: string;
  plans: Plan[];
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    faq_text?: string;
  };
}

function PlansSection({ plans, settings, sectionData, brandColor = '#3b82f6' }: PlansSectionProps) {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { ref, isVisible } = useScrollAnimation();

  const enabledPlans = plans.filter(plan => {
    if (plan.is_plan_enable !== 'on') return false;
    const billingType = billingCycle === 'yearly' ? 'yearly' : 'monthly';
    return plan.duration === billingType || plan.duration === 'both';
  });

  const formatCurrency = (amount: string | number) => {
    if (typeof window !== 'undefined' && window.appSettings?.formatCurrency) {
      const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount as string);
      return window.appSettings.formatCurrency(numericAmount, { showSymbol: true });
    }
    return amount;
  };

  const getPrice = React.useCallback((plan: Plan) => {
    if (billingCycle === 'yearly' && plan.yearly_price !== undefined) return plan.yearly_price;
    return plan.price;
  }, [billingCycle]);

  const planFeatures = [
    { key: 'Custom Domain', label: t('Custom Domain') },
    { key: 'Subdomain', label: t('Custom Subdomain') },
    { key: 'PWA', label: t('PWA Support') },
    { key: 'AI Integration', label: t('AI Integration') },
    { key: 'Password Protection', label: t('Password Protection') },
    { key: 'Custom CSS/JS', label: t('Custom CSS/JS') },
    { key: 'Google Wallet', label: t('Google Wallet') },
    { key: 'Bio Link', label: t('Bio Link') },
    { key: 'vCard Builder', label: t('vCard Builder') },
    { key: 'Broadcast Email', label: t('Broadcast Email') },
    { key: 'Template Sections', label: t('Template Sections') },
  ];

  const isFeatureIncluded = (plan: Plan, featureKey: string): boolean => {
    if (!plan.features) return false;
    if (Array.isArray(plan.features)) {
      if (featureKey === 'Template Sections') return plan.features.some(f => f.startsWith(t('Template Sections')));
      if (featureKey === 'Bio Link') return plan.features.some(f => f.startsWith(t('Bio Link Builder')));
      if (featureKey === 'vCard Builder') return plan.features.some(f => f.startsWith(t('vCard Builder')));
      return plan.features.includes(featureKey);
    }
    if (typeof plan.features === 'object') {
      const featureKeyMap: Record<string, string> = {
        'Custom CSS/JS': 'custom_css_js',
        'Broadcast Email': 'broadcast_email',
        'Custom Domain': 'custom_domain',
        'Subdomain': 'custom_subdomain',
        'PWA': 'pwa_support',
        'AI Integration': 'ai_integration',
        'Password Protection': 'password_protection',
        'Google Wallet': 'google_wallet',
        'Bio Link': 'bio_link',
        'vCard Builder': 'vcard_builder',
      };
      return (plan.features as any)[featureKeyMap[featureKey] || featureKey] === true;
    }
    return false;
  };

  const getTemplateSectionsText = (plan: Plan) => {
    if (Array.isArray(plan.features)) {
      return plan.features.find(f => f.startsWith(t('Template Sections'))) || t('Template Sections');
    }
    return t('Template Sections');
  };

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || t('Choose Your Plan')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
            {sectionData?.subtitle || t('Start with our free plan and upgrade as you grow. All plans include our core features with no setup fees or hidden costs.')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              {t('Monthly')}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
              style={{ backgroundColor: billingCycle === 'yearly' ? brandColor : '#e5e7eb' }}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              {t('Yearly')}
            </span>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {enabledPlans.map((plan) => (
            <div key={plan.id} className="relative h-full flex flex-col">
              <div
                className="relative h-full flex flex-col rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                style={{
                  border: plan.is_popular ? `3px solid ${brandColor}` : '2px solid #e5e7eb',
                }}
              >
                {/* Recommended Badge */}
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="text-white px-5 py-2 rounded-full shadow-md flex items-center gap-1.5 text-sm font-semibold" style={{ backgroundColor: brandColor }}>
                      <Sparkles className="h-4 w-4" />
                      {t('Recommended')}
                    </div>
                  </div>
                )}

                <div className="flex flex-col h-full p-7">
                  {/* Header */}
                  <div className="text-center mb-6 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-extrabold" style={{ color: plan.is_popular ? brandColor : '#111827' }}>
                        {formatCurrency(getPrice(plan))}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        /{billingCycle === 'yearly' ? t('year') : t('month')}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                    )}
                    {plan.trial_days > 0 && (
                      <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                        <Zap className="h-3 w-3" />
                        {t('{{days}} days free trial', { days: plan.trial_days })}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-5" />

                  {/* Stats */}
                  <div className="mb-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold" style={{ color: brandColor }}>{plan.stats?.businesses ?? '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">{t('Businesses')}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold" style={{ color: brandColor }}>{plan.stats?.users ?? '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">{t('Users')}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold" style={{ color: brandColor }}>{plan.stats?.storage ?? '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">{t('Storage')}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center mt-3">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold" style={{ color: brandColor }}>{plan.stats?.templates ?? '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">{t('Templates')}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold" style={{ color: brandColor }}>{plan.stats?.bio_links ?? '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">{t('Bio Links')}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold" style={{ color: brandColor }}>{plan.stats?.bio_links_templates ?? '-'}</div>
                        <div className="text-xs text-gray-500 font-medium">{t('Bio Themes')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-5">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('Features')}</h4>
                    <ul className="space-y-2">
                      {planFeatures.map((feature, index) => {
                        const included = isFeatureIncluded(plan, feature.key);
                        return (
                          <li key={index} className="flex items-start gap-2.5">
                            {included ? (
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: brandColor }} />
                            ) : (
                              <X className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm leading-tight ${included ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                              {feature.key === 'Template Sections' ? getTemplateSectionsText(plan) : feature.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Addons */}
                  {plan.stats?.addons > 0 && plan.stats?.addon_names && plan.stats.addon_names.length > 0 && (
                    <div className="mb-5">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Box className="h-4 w-4" style={{ color: brandColor }} />
                          <span className="text-xs font-semibold text-gray-700">
                            {t('Included Addons')} ({plan.stats.addons})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.stats.addon_names.map((name, index) => (
                            <span key={index} className="inline-block bg-white px-2 py-1 rounded text-xs font-medium border border-gray-200" style={{ color: brandColor }}>
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto pt-5 border-t border-gray-200">
                    <Link
                      href={route('register', { plan: encryptPlanId(plan.id) })}
                      className="flex items-center justify-center w-full py-3 px-6 rounded-lg font-semibold transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: plan.is_popular ? brandColor : '#f3f4f6',
                        color: plan.is_popular ? 'white' : '#111827',
                      }}
                    >
                      {getPrice(plan) === 0 ? t('Start Free') : t('Get Started')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        {sectionData?.faq_text && (
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-gray-600">{sectionData.faq_text}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default PlansSection;
