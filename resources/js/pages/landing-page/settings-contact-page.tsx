import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, MapPin, Phone, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContactPageSettings({ data, setData, errors, handleInputChange, getSectionData, updateSectionData }) {
  const { t } = useTranslation();
  const contactPageData = getSectionData ? getSectionData('contact-page') : {};
  
  const handleContactPageChange = (field, value) => {
    if (updateSectionData) {
      updateSectionData('contact-page', { [field]: value });
    } else {
      // Fallback for direct data updates
      setData(field, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active/Inactive Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('Contact Page Settings')}</h3>
              <p className="text-sm text-gray-500">{t('Configure contact page visibility and content')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('Active')}</Label>
            <Switch
              checked={contactPageData.active !== false}
              onCheckedChange={(checked) => handleContactPageChange('active', checked)}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Page Content')}</h3>
            <p className="text-sm text-gray-500">{t('Configure contact page title and description')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="contact_page_title">{t('Page Title')}</Label>
            <Input
              id="contact_page_title"
              name="contact_page_title"
              value={contactPageData.title || t('Contact Us')}
              onChange={(e) => handleContactPageChange('title', e.target.value)}
              placeholder={t('Contact Us')}
            />
            {errors.contact_page_title && (
              <p className="text-red-600 text-sm">{errors.contact_page_title}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_page_description">{t('Page Description')}</Label>
            <Textarea
              id="contact_page_description"
              name="contact_page_description"
              value={contactPageData.description || t("We're here to help! Get in touch with our team and we'll get back to you as soon as possible.")}
              onChange={(e) => handleContactPageChange('description', e.target.value)}
              placeholder={t("We're here to help! Get in touch with our team and we'll get back to you as soon as possible.")}
              rows={3}
            />
            {errors.contact_page_description && (
              <p className="text-red-600 text-sm">{errors.contact_page_description}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_page_form_title">{t('Form Title')}</Label>
            <Input
              id="contact_page_form_title"
              name="contact_page_form_title"
              value={contactPageData.form_title || t('Send us a Message')}
              onChange={(e) => handleContactPageChange('form_title', e.target.value)}
              placeholder={t('Send us a Message')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Phone className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Contact Information')}</h3>
            <p className="text-sm text-gray-500">{t('Company contact details')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="contact_page_email">{t('Contact Email')}</Label>
            <Input
              id="contact_page_email"
              name="contact_page_email"
              type="email"
              value={contactPageData.email || 'workdo@example.com'}
              onChange={(e) => handleContactPageChange('email', e.target.value)}
              placeholder="workdo@example.com"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="contact_page_phone">{t('Contact Phone')}</Label>
            <Input
              id="contact_page_phone"
              name="contact_page_phone"
              value={contactPageData.phone || '+917485962563'}
              onChange={(e) => handleContactPageChange('phone', e.target.value)}
              placeholder="+917485962563"
            />
          </div>
          
          <div className="space-y-3 md:col-span-2">
            <Label htmlFor="contact_page_address">{t('Contact Address')}</Label>
            <Input
              id="contact_page_address"
              name="contact_page_address"
              value={contactPageData.address || 'San Francisco, CA'}
              onChange={(e) => handleContactPageChange('address', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Business Hours')}</h3>
            <p className="text-sm text-gray-500">{t('Configure business hours display')}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="contact_page_show_business_hours">{t('Show Business Hours')}</Label>
            <Switch
              id="contact_page_show_business_hours"
              name="contact_page_show_business_hours"
              checked={contactPageData.show_business_hours !== false}
              onCheckedChange={(checked) => handleContactPageChange('show_business_hours', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="contact_page_weekdays_hours">{t('Weekdays Hours')}</Label>
              <Input
                id="contact_page_weekdays_hours"
                name="contact_page_weekdays_hours"
                value={contactPageData.weekdays_hours || 'Monday - Friday: 9:00 AM - 6:00 PM EST'}
                onChange={(e) => handleContactPageChange('weekdays_hours', e.target.value)}
                placeholder="Monday - Friday: 9:00 AM - 6:00 PM EST"
                disabled={contactPageData.show_business_hours === false}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="contact_page_weekend_hours">{t('Weekend Hours')}</Label>
              <Input
                id="contact_page_weekend_hours"
                name="contact_page_weekend_hours"
                value={contactPageData.weekend_hours || 'Saturday: 10:00 AM - 4:00 PM EST'}
                onChange={(e) => handleContactPageChange('weekend_hours', e.target.value)}
                placeholder="Saturday: 10:00 AM - 4:00 PM EST"
                disabled={contactPageData.show_business_hours === false}
              />
            </div>
            
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="contact_page_sunday_hours">{t('Sunday Hours')}</Label>
              <Input
                id="contact_page_sunday_hours"
                name="contact_page_sunday_hours"
                value={contactPageData.sunday_hours || 'Sunday: Closed'}
                onChange={(e) => handleContactPageChange('sunday_hours', e.target.value)}
                placeholder="Sunday: Closed"
                disabled={contactPageData.show_business_hours === false}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-100 rounded-lg">
            <MapPin className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Map Settings')}</h3>
            <p className="text-sm text-gray-500">{t('Configure map display and location')}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="contact_page_show_map">{t('Show Map')}</Label>
            <Switch
              id="contact_page_show_map"
              name="contact_page_show_map"
              checked={contactPageData.show_map === true}
              onCheckedChange={(checked) => handleContactPageChange('show_map', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="contact_page_map_location">{t('Map Location')}</Label>
              <Input
                id="contact_page_map_location"
                name="contact_page_map_location"
                value={contactPageData.map_location || 'San Francisco, CA'}
                onChange={(e) => handleContactPageChange('map_location', e.target.value)}
                placeholder="San Francisco, CA"
                disabled={contactPageData.show_map === false}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="contact_page_map_embed_url">{t('Map Embed URL')}</Label>
              <Input
                id="contact_page_map_embed_url"
                name="contact_page_map_embed_url"
                value={contactPageData.map_embed_url || ''}
                onChange={(e) => handleContactPageChange('map_embed_url', e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
                disabled={contactPageData.show_map === false}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Information Sections')}</h3>
            <p className="text-sm text-gray-500">{t('Configure contact information sections')}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {(contactPageData.sections || []).map((section, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  {t('Section')} {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => {
                    const newSections = (contactPageData.sections || []).filter((_, i) => i !== index);
                    handleContactPageChange('sections', newSections);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>{t('Section Title')}</Label>
                  <Input
                    value={section.title || ''}
                    onChange={(e) => {
                      const newSections = [...(contactPageData.sections || [])];
                      newSections[index] = { ...newSections[index], title: e.target.value };
                      handleContactPageChange('sections', newSections);
                    }}
                    placeholder={t('Get in Touch')}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>{t('Color')}</Label>
                  <select
                    value={section.color || 'blue'}
                    onChange={(e) => {
                      const newSections = [...(contactPageData.sections || [])];
                      newSections[index] = { ...newSections[index], color: e.target.value };
                      handleContactPageChange('sections', newSections);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="blue">{t('Blue')}</option>
                    <option value="green">{t('Green')}</option>
                    <option value="purple">{t('Purple')}</option>
                    <option value="red">{t('Red')}</option>
                    <option value="yellow">{t('Yellow')}</option>
                    <option value="indigo">{t('Indigo')}</option>
                  </select>
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <Label>{t('Content')}</Label>
                  <Textarea
                    value={section.content || ''}
                    onChange={(e) => {
                      const newSections = [...(contactPageData.sections || [])];
                      newSections[index] = { ...newSections[index], content: e.target.value };
                      handleContactPageChange('sections', newSections);
                    }}
                    placeholder={t("We'd love to hear from you...")}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <Label>{t('Items (one per line)')}</Label>
                  <Textarea
                    value={(section.items || []).join('\n')}
                    onChange={(e) => {
                      const newSections = [...(contactPageData.sections || [])];
                      newSections[index] = { ...newSections[index], items: e.target.value.split('\n').filter(item => item.trim()) };
                      handleContactPageChange('sections', newSections);
                    }}
                    placeholder="Email: contact@example.com\nPhone: +1 234 567 8900\nAddress: 123 Main St"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-dashed"
            onClick={() => {
              const newSections = [...(contactPageData.sections || []), {
                title: '',
                content: '',
                color: 'blue',
                items: []
              }];
              handleContactPageChange('sections', newSections);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('Add Information Section')}
          </Button>
        </div>
      </div>
    </div>
  );
}