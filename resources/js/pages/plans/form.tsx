import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { businessTypeOptions } from '@/pages/vcard-builder/business-templates';
import { bioLinkTypes } from '@/pages/link-bio-builder/themes';
import { ArrowLeft } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  price: number;
  yearly_price: number | null;
  duration: string;
  description: string | null;
  business: number;
  bio_links: number;
  max_users: number;
  storage_limit: number;
  enable_custdomain: string;
  enable_custsubdomain: string;
  pwa_business: string;
  enable_chatgpt: string;
  themes: string[] | null;
  bio_links_themes: string[] | null;
  addons: string[] | null;
  is_trial: string | null;
  trial_day: number;
  is_plan_enable: string;
  is_default: boolean;
}

interface Addon {
  id: number;
  name: string;
  description: string;
  category: string;
  package_name: string;
}

interface Props {
  plan?: Plan;
  hasDefaultPlan?: boolean;
  otherDefaultPlanExists?: boolean;
  availableAddons?: Addon[];
}

export default function PlanForm({ plan, hasDefaultPlan = false, otherDefaultPlanExists = false, availableAddons = [] }: Props) {
  const { t } = useTranslation();
  const { errors } = usePage().props;
  const [processing, setProcessing] = useState(false);
  const [themeSearch, setThemeSearch] = useState('');
  const [bioThemeSearch, setBioThemeSearch] = useState('');
  const [sectionSearch, setSectionSearch] = useState('');
  const [addonSearch, setAddonSearch] = useState('');
  const isEdit = !!plan;
  const isFreeplan = isEdit && plan?.price === 0;
  const templateSectionOptions = {
    'header': t('Header & Logo'),
    'about': t('About Section'),
    'services': t('Services & Offerings'),
    'portfolio': t('Portfolio & Gallery'),
    'testimonials': t('Testimonials & Reviews'),
    'contact': t('Contact Information'),
    'social': t('Social Media Links'),
    'business_hours': t('Business Hours'),
    'gallery': t('Photo Gallery'),
    'appointments': t('Appointment Booking'),
    'google_map': t('Location & Maps'),
    'app_download': t('App Download Links'),
    'contact_form': t('Contact Form'),
    'custom_html': t('Custom HTML Content'),
    'qr_share': t('QR Code Sharing'),
    'language': t('Language Settings'),
    'thank_you': t('Thank You Message'),
    'seo': t('SEO Settings'),
    'pixels': t('Analytics & Pixels'),
    'copyright': t('Copyright Information'),
    'videos': t('Videos'),
    'youtube': t('YouTube Channel'),
    'featured': t('Featured Banner'),
    'categories': t('Product Categories'),
    'products': t('Products'),
    'benefits': t('Shopping Benefits'),
    'newsletter': t('Newsletter'),
    'menu_highlights': t('Menu Highlights'),
    'specials': t('Specials'),
    'featured_products': t('Featured Products'),
    'catering': t('Catering'),
    'signature_dishes': t('Signature Dishes'),
    'certifications': t('Certifications'),
    'credentials': t('Credentials'),
    'projects': t('Projects'),
    'case_studies': t('Case Studies'),
    'specialties': t('Medical Specialties'),
    'transformations': t('Transformations'),
    'programs': t('Training Programs'),
    'design_process': t('Design Process'),
    'streaming': t('Streaming Info'),
    'schedule': t('Schedule'),
    'class_schedule': t('Class Schedule'),
    'delivery_info': t('Delivery Information'),
    'emergency_info': t('Emergency Services'),
    'practice_areas': t('Practice Areas'),
    'speaking': t('Speaking Engagements'),
    'music': t('Music'),
    'tour_dates': t('Tour Dates'),
    'band_members': t('Band Members'),
    'merchandise': t('Merchandise'),
    'classes': t('Classes'),
    'trainers': t('Trainers'),
    'membership': t('Membership'),
    'offerings': t('Offerings'),
    'process_steps': t('Process Steps'),
    'destinations': t('Destinations'),
    'market_stats': t('Market Statistics'),
    'transformation': t('Transformations'),
    'features': t('Key Features'),
    'team': t('Our Team'),
    'pricing': t('Pricing Plans'),
    'venues': t('Preferred Venues'),
    'faq': t('FAQ'),
    'pet_care_tips': t('Pet Care Tips'),
    'achievements': t('Achievements & Certifications'),
    'transformation_stories': t('Success Stories'),
    'animal_care': t('Animal Care Tips'),
    'emergency': t('Emergency Care'),
    'specialists': t('Specialists'),
    'shows': t('Shows & Content'),
    'action_buttons': t('Action Buttons'),
    'featured_listings': t('Featured Listings'),
    'promotions': t('Promotions & Offers'),
    'footer': t('Footer'),
    'coaches': t('Coaching Staff'),
    'episodes': t('Episode List'),
    'insurance_services': t('Insurance Services'),
    'claims_support': t('Claims Support'),
    'content': t('Featured Content'),
    'stats': t('Platform Stats'),
    'media_kit': t('Media Kit'),
    'booking': t('Booking'),
    'collaborations': t('Collaborations'),
    'daily_specials': t('Daily Specials'),
    'dining': t('Dining Options'),
    'rooms': t('Rooms & Accommodations'),
    'special_offers': t('Special Offers'),
    'awards': t('Awards & Recognitions'),
  };
  const allTemplateSections = Object.keys(templateSectionOptions);
  const filteredTemplateSections = Object.entries(templateSectionOptions).filter(([, label]) =>
    label.toLowerCase().includes(sectionSearch.toLowerCase())
  );
  
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || 0,
    yearly_price: plan?.yearly_price || 0,
    duration: plan?.duration || 'monthly',

    description: plan?.description || '',
    business: plan?.business || 0,
    bio_links: plan?.bio_links || 0,
    max_users: plan?.max_users || 0,
    storage_limit: plan?.storage_limit || 0,
    enable_custdomain: plan?.enable_custdomain || 'off',
    enable_custsubdomain: plan?.enable_custsubdomain || 'off',
    pwa_business: plan?.pwa_business || 'off',
    enable_chatgpt: plan?.enable_chatgpt || 'off',
    themes: Array.isArray(plan?.themes) ? plan.themes : (plan?.themes ? [plan.themes] : []),
    bio_links_themes: Array.isArray(plan?.bio_links_themes) ? plan.bio_links_themes : (plan?.bio_links_themes ? [plan.bio_links_themes] : []),
    addons: Array.isArray(plan?.addons) ? plan.addons : [],
    features: plan?.features || {},
    is_trial: plan?.is_trial || null,
    trial_day: plan?.trial_day || 0,
    is_plan_enable: plan?.is_plan_enable || 'on',
    is_default: plan?.is_default || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked ? 'on' : 'off' }));
  };

  const handleDefaultChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_default: checked }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }));
  };

  const handleTemplateSectionChange = (section: string, checked: boolean) => {
    setFormData(prev => {
      const currentSections = prev.features.business_template_sections || [];
      const newSections = checked 
        ? [...currentSections, section]
        : currentSections.filter(s => s !== section);
      
      return {
        ...prev,
        features: {
          ...prev.features,
          business_template_sections: newSections
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    if (isEdit) {
      router.put(route('plans.update', plan.id), formData, {
        onFinish: () => setProcessing(false)
      });
    } else {
      router.post(route('plans.store'), formData, {
        onFinish: () => setProcessing(false)
      });
    }
  };

  return (
    <PageTemplate 
      title={t(isEdit ? "Edit Plan" : "Create Plan")}
      description={t(isEdit ? "Update subscription plan details" : "Add a new subscription plan")}
      url={isEdit ? route('plans.update', plan.id) : "/plans/create"}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Plans'), href: route('plans.index') },
        { title: t(isEdit ? 'Edit Plan' : 'Create Plan') }
      ]}
      actions={[
        {
          label: t('Back'),
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
          variant: 'outline',
          onClick: () => router.get(route('plans.index')),
        },
      ]}
    >
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t("Plan Name")}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("Enter plan name")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="duration">{t("Plan Type")}</Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select plan type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                    <SelectItem value="yearly">{t("Yearly")}</SelectItem>
                    <SelectItem value="both">{t("Both")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!(isEdit && isFreeplan) && (formData.duration === 'monthly' || formData.duration === 'both') && (
                <div>
                  <Label htmlFor="price">{t("Monthly Price")}</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required={formData.duration === 'monthly' || formData.duration === 'both'}
                  />
                  {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                  {formData.price > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {t("Monthly price")}: {window.appSettings.formatCurrency(formData.price.toLocaleString())}
                    </p>
                  )}
                </div>
              )}

              {!(isEdit && isFreeplan) && (formData.duration === 'yearly' || formData.duration === 'both') && (
                <div>
                  <Label htmlFor="yearly_price">{t("Yearly Price")}</Label>
                  <Input
                    id="yearly_price"
                    name="yearly_price"
                    type="number"
                    step="0.01"
                    value={formData.yearly_price}
                    onChange={handleChange}
                    required={formData.duration === 'yearly' || formData.duration === 'both'}
                  />
                  {errors.yearly_price && <p className="text-sm text-red-600 mt-1">{errors.yearly_price}</p>}
                  <p className="text-xs text-blue-600 mt-1">
                    {t("Yearly price")}: {window.appSettings.formatCurrency(formData.yearly_price.toLocaleString())}
                  </p>
                </div>
              )}
              
              <div>
                <Label htmlFor="description">{t("Description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t("Enter plan description")}
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="business">{t("Number of Businesses")}</Label>
                <Input
                  id="business"
                  name="business"
                  type="number"
                  value={formData.business}
                  onChange={handleChange}
                  required
                />
                {errors.business && <p className="text-sm text-red-600 mt-1">{errors.business}</p>}
              </div>

              <div>
                <Label htmlFor="bio_links">{t("Number of Bio Links")}</Label>
                <Input
                  id="bio_links"
                  name="bio_links"
                  type="number"
                  value={formData.bio_links}
                  onChange={handleChange}
                  required
                />
                {errors.bio_links && <p className="text-sm text-red-600 mt-1">{errors.bio_links}</p>}
              </div>

              <div>
                <Label htmlFor="max_users">{t("Maximum Users")}</Label>
                <Input
                  id="max_users"
                  name="max_users"
                  type="number"
                  value={formData.max_users}
                  onChange={handleChange}
                  required
                />
                {errors.max_users && <p className="text-sm text-red-600 mt-1">{errors.max_users}</p>}
              </div>

              <div>
                <Label htmlFor="storage_limit">{t("Storage Limit (GB)")}</Label>
                <Input
                  id="storage_limit"
                  name="storage_limit"
                  type="number"
                  step="0.01"
                  value={formData.storage_limit}
                  onChange={handleChange}
                  required
                />
                {errors.storage_limit && <p className="text-sm text-red-600 mt-1">{errors.storage_limit}</p>}
              </div>

              {formData.is_trial === 'on' && (
                <div>
                  <Label htmlFor="trial_day">{t("Trial Days")}</Label>
                  <Input
                    id="trial_day"
                    name="trial_day"
                    type="number"
                    value={formData.trial_day}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">{t("Features")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Features */}
              <div className="flex items-center justify-between">
                <Label htmlFor="custom_domain">{t("Custom Domain")}</Label>
                <Switch
                  id="custom_domain"
                  checked={formData.features.custom_domain || false}
                  onCheckedChange={(checked) => handleFeatureChange('custom_domain', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="custom_subdomain">{t("Custom Subdomain")}</Label>
                <Switch
                  id="custom_subdomain"
                  checked={formData.features.custom_subdomain || false}
                  onCheckedChange={(checked) => handleFeatureChange('custom_subdomain', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pwa_support">{t("PWA Support")}</Label>
                <Switch
                  id="pwa_support"
                  checked={formData.features.pwa_support || false}
                  onCheckedChange={(checked) => handleFeatureChange('pwa_support', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="ai_integration">{t("AI Integration")}</Label>
                <Switch
                  id="ai_integration"
                  checked={formData.features.ai_integration || false}
                  onCheckedChange={(checked) => handleFeatureChange('ai_integration', checked)}
                />
              </div>
            
              <div className="flex items-center justify-between">
                <Label htmlFor="password_protection">{t("Password Protection")}</Label>
                <Switch
                  id="password_protection"
                  checked={formData.features.password_protection || false}
                  onCheckedChange={(checked) => handleFeatureChange('password_protection', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="custom_css_js">{t("Custom CSS/JS")}</Label>
                <Switch
                  id="custom_css_js"
                  checked={formData.features.custom_css_js || false}
                  onCheckedChange={(checked) => handleFeatureChange('custom_css_js', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="google_wallet">{t("Google Wallet")}</Label>
                <Switch
                  id="google_wallet"
                  checked={formData.features.google_wallet || false}
                  onCheckedChange={(checked) => handleFeatureChange('google_wallet', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="bio_link">{t("Bio Link")}</Label>
                <Switch
                  id="bio_link"
                  checked={formData.features.bio_link !== false}
                  onCheckedChange={(checked) => handleFeatureChange('bio_link', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vcard_builder">{t("vCard Builder")}</Label>
                <Switch
                  id="vcard_builder"
                  checked={formData.features.vcard_builder !== false}
                  onCheckedChange={(checked) => handleFeatureChange('vcard_builder', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="broadcast_email">{t("Broadcast Email")}</Label>
                <Switch
                  id="broadcast_email"
                  checked={formData.features.broadcast_email === true}
                  onCheckedChange={(checked) => handleFeatureChange('broadcast_email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_trial">{t("Enable Trial")}</Label>
                <Switch
                  id="is_trial"
                  checked={formData.is_trial === 'on'}
                  onCheckedChange={(checked) => handleSwitchChange('is_trial', checked)}
                />
              </div>
            </div>
            
            {/* Business Template Sections */}
            <div>
              <Label>{t("Business Template Sections")}</Label>
              <p className="text-xs text-muted-foreground mb-3">
                {t("Select which sections users can access in their business templates. Leave empty to allow all sections.")}
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("Search sections...")}
                    value={sectionSearch}
                    onChange={(e) => setSectionSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSectionSearch('')}
                  >
                    {t("Clear")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        features: {
                          ...prev.features,
                          business_template_sections: allTemplateSections
                        }
                      }));
                    }}
                  >
                    {t("Select All")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        features: {
                          ...prev.features,
                          business_template_sections: []
                        }
                      }));
                    }}
                  >
                    {t("Unselect All")}
                  </Button>
                </div>
                
                <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {filteredTemplateSections.map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`section_${key}`}
                          checked={(formData.features.business_template_sections || []).includes(key)}
                          onCheckedChange={(checked) => handleTemplateSectionChange(key, checked)}
                        />
                        <label htmlFor={`section_${key}`} className="text-sm cursor-pointer">
                          {t(label)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">{t("Business Templates")}</h3>
            
            <div>
              <Label>{t("Available Business Templates")} ({Array.isArray(formData.themes) ? formData.themes.length : 0}/{businessTypeOptions.length})</Label>
              <p className="text-xs text-muted-foreground mb-3">
                {t("Select business templates to include in this plan. Leave empty to allow all templates.")}
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("Search business themes...")}
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setThemeSearch('')}
                  >
                    {t("Clear")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, themes: businessTypeOptions.map(t => t.value) }))}
                  >
                    {t("Select All")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, themes: [] }))}
                  >
                    {t("Unselect All")}
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {businessTypeOptions
                      .filter(template => template.label.toLowerCase().includes(themeSearch.toLowerCase()))
                      .map((template, index) => (
                      <div key={template.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={template.value}
                          checked={Array.isArray(formData.themes) && formData.themes.includes(template.value)}
                          onCheckedChange={(checked) => {
                            const currentThemes = Array.isArray(formData.themes) ? formData.themes : [];
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                themes: [...currentThemes, template.value]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                themes: currentThemes.filter(t => t !== template.value)
                              }));
                            }
                          }}
                        />
                        <label htmlFor={template.value} className="text-sm cursor-pointer">
                          Theme {index + 1}: {template.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">{t("Bio Links Templates")}</h3>
            
            <div>
              <Label>{t("Available Bio Links Templates")} ({Array.isArray(formData.bio_links_themes) ? formData.bio_links_themes.length : 0}/{bioLinkTypes.length})</Label>
              <p className="text-xs text-muted-foreground mb-3">
                {t("Select bio links templates to include in this plan. Leave empty to allow all templates.")}
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("Search bio themes...")}
                    value={bioThemeSearch}
                    onChange={(e) => setBioThemeSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBioThemeSearch('')}
                  >
                    {t("Clear")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, bio_links_themes: bioLinkTypes.map(t => t.value) }))}
                  >
                    {t("Select All")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, bio_links_themes: [] }))}
                  >
                    {t("Unselect All")}
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {bioLinkTypes
                      .filter(template => template.label.toLowerCase().includes(bioThemeSearch.toLowerCase()))
                      .map((template, index) => (
                      <div key={`bio_${template.value}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`bio_${template.value}`}
                          checked={Array.isArray(formData.bio_links_themes) && formData.bio_links_themes.includes(template.value)}
                          onCheckedChange={(checked) => {
                            const currentThemes = Array.isArray(formData.bio_links_themes) ? formData.bio_links_themes : [];
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                bio_links_themes: [...currentThemes, template.value]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                bio_links_themes: currentThemes.filter(t => t !== template.value)
                              }));
                            }
                          }}
                        />
                        <label htmlFor={`bio_${template.value}`} className="text-sm cursor-pointer">
                          Theme {bioLinkTypes.indexOf(template) + 1}: {template.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>



          {availableAddons.length > 0 && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">{t("Addons")}</h3>
              
              <div>
                <Label>{t("Available Addons")} ({Array.isArray(formData.addons) ? formData.addons.length : 0}/{availableAddons.length})</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("Select addons to include in this plan. Only selected addons will be available to users with this plan.")}
                </p>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("Search addons...")}
                      value={addonSearch}
                      onChange={(e) => setAddonSearch(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAddonSearch('')}
                    >
                      {t("Clear")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, addons: availableAddons.map(a => a.package_name) }))}
                    >
                      {t("Select All")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, addons: [] }))}
                    >
                      {t("Unselect All")}
                    </Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {availableAddons
                        .filter(addon => 
                          addon.name.toLowerCase().includes(addonSearch.toLowerCase()) ||
                          addon.description.toLowerCase().includes(addonSearch.toLowerCase()) ||
                          addon.category.toLowerCase().includes(addonSearch.toLowerCase())
                        )
                        .map((addon) => (
                        <div key={`addon_${addon.id}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`addon_${addon.id}`}
                            checked={Array.isArray(formData.addons) && formData.addons.includes(addon.package_name)}
                            onCheckedChange={(checked) => {
                              const currentAddons = Array.isArray(formData.addons) ? formData.addons : [];
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  addons: [...currentAddons, addon.package_name]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  addons: currentAddons.filter(pkg => pkg !== addon.package_name)
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`addon_${addon.id}`} className="text-sm cursor-pointer">
                            {addon.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {availableAddons.filter(addon => 
                      addon.name.toLowerCase().includes(addonSearch.toLowerCase()) ||
                      addon.description.toLowerCase().includes(addonSearch.toLowerCase()) ||
                      addon.category.toLowerCase().includes(addonSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        {addonSearch ? t("No addons found matching your search.") : t("No addons available.")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">{t("Settings")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_plan_enable">{t("Active")}</Label>
                <Switch
                  id="is_plan_enable"
                  checked={formData.is_plan_enable === 'on'}
                  onCheckedChange={(checked) => handleSwitchChange('is_plan_enable', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_default">{t("Default Plan")}</Label>
                  {(isEdit ? !plan?.is_default : hasDefaultPlan) && (
                    <p className="text-xs text-amber-600 mt-1">
                      {t("Setting this as default will remove default status from the current default plan.")}
                    </p>
                  )}
                </div>
                <Switch
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={handleDefaultChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.get(route('plans.index'))}
            >
              {t("Cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
            >
              {processing ? t(isEdit ? "Updating..." : "Creating...") : t(isEdit ? "Update Plan" : "Create Plan")}
            </Button>
          </div>
        </form>
      </div>
    </PageTemplate>
  );
}
