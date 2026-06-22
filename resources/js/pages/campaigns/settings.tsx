import { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { Repeater } from '@/components/ui/repeater';
import { Plus, Edit, Trash2, Settings, Tag, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SettingsSection } from '@/components/settings-section';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';

export default function CampaignSettingsPage() {
  const { t } = useTranslation();
  const { settings, flash } = usePage().props as any;
  const [activeSection, setActiveSection] = useState('pricing-settings');
  
  // Settings form state
  const [settingsData, setSettingsData] = useState({
    pricing_tiers: settings?.pricing_tiers || [
      { min_days: 1, max_days: 30, per_day_price: 15.00 },
      { min_days: 31, max_days: 90, per_day_price: 12.00 },
      { min_days: 91, max_days: 365, per_day_price: 10.00 }
    ]
  });
  
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.post(route('campaigns.settings.update'), { pricing_tiers: settingsData.pricing_tiers }, {
      onSuccess: () => {
        // toast.success(t('Settings updated successfully'));
      },
      onError: (errors) => {
        toast.error(`Failed to update settings: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  // Define sidebar navigation items
  const sidebarNavItems: NavItem[] = [
    {
      title: t('Pricing Settings'),
      href: '#pricing-settings',
      icon: <Settings className="h-4 w-4 mr-2" />
    }
  ];

  // Handle navigation click
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Campaigns'), href: route('campaigns.index') },
    { title: t('Settings') }
  ];

  return (
    <PageTemplate 
      title={t("Campaign Settings")} 
      url="/campaigns/settings"
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="pr-4 space-y-1">
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn('w-full justify-start', {
                      'bg-muted font-medium': activeSection === item.href.replace('#', ''),
                    })}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Pricing Settings Section */}
          <section id="pricing-settings" className="mb-8">
            <SettingsSection
              title={t("Pricing Settings")}
              description={t("Configure multiple pricing tiers based on campaign duration")}
              action={
                <Button type="submit" form="pricing-settings-form" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {t("Save Changes")}
                </Button>
              }
            >
              <form id="pricing-settings-form" onSubmit={handleSettingsSubmit} className="space-y-6">
                <Repeater
                  fields={[
                    {
                      name: 'min_days',
                      label: t('Minimum Days'),
                      type: 'number',
                      placeholder: '1',
                      required: true,
                      min: 1
                    },
                    {
                      name: 'max_days',
                      label: t('Maximum Days'),
                      type: 'number',
                      placeholder: '365',
                      required: true,
                      min: 1
                    },
                    {
                      name: 'per_day_price',
                      label: t('Price Per Day ({{symbol}})', { symbol: window?.appSettings?.currencySettings?.currencySymbol || '$' }),
                      type: 'number',
                      placeholder: '10.00',
                      required: true,
                      min: 0,
                      step: 0.01
                    }
                  ]}
                  value={settingsData.pricing_tiers}
                  onChange={(pricing_tiers) => setSettingsData(prev => ({ ...prev, pricing_tiers }))}
                  minItems={1}
                  maxItems={-1}
                  addButtonText={t("Add Pricing Tier")}
                  removeButtonText=""
                  showItemNumbers={true}
                  emptyMessage={t("No pricing tiers configured. Add at least one tier.")}
                  itemClassName=""
                />
              </form>
            </SettingsSection>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
}