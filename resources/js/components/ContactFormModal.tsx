import React, { useState } from 'react';
import axios from '@/utils/axios-config';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';
import { showToast } from '@/components/ui/toast-notification';
import { useTranslation } from 'react-i18next';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
  businessName: string;
  themeColors?: any;
  themeFont?: string;
}

export default function ContactFormModal({ isOpen, onClose, businessId, businessName, themeColors, themeFont }: ContactFormModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    business_id: businessId,
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  
  // Check if we're in builder/edit mode
  const isInBuilderMode = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    const hasBuilderElements = 
      document.querySelector('.business-card-container') !== null ||
      document.querySelector('[class*="Live Preview"]') !== null ||
      document.querySelector('[class*="vcard-builder"]') !== null ||
      window.location.pathname.includes('/vcard-builder/') ||
      window.location.pathname.includes('/edit') ||
      window.location.pathname.includes('/create');
    
    return hasBuilderElements;
  }, []);
  
  // Don't open modal in builder mode
  const shouldOpen = isOpen && !isInBuilderMode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Handle preview mode (businessId is 0 or invalid)
    if (!businessId || businessId === 0) {
      setFormData({
        business_id: businessId,
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      onClose();
      showToast(t('Message sent successfully!'), 'success');
      setProcessing(false);
      return;
    }
    
    try {
      const response = await axios.post(route('public.contact.store'), formData);
      setFormData({
        business_id: businessId,
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      onClose();
      showToast(response.data.message, 'success');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showToast(t('There was a problem submitting your form'), 'error');
      }
    } finally {
      setProcessing(false);
    }
  };

  // Apply theme styles
  const modalBg = themeColors?.codeBlock || themeColors?.background || themeColors?.accent || '#ffffff';
  const modalText = themeColors?.text || '#000000';
  const modalBorder = themeColors?.borderColor || themeColors?.primary || '#e2e8f0';
  const modalPrimary = themeColors?.primary || '#3b82f6';
  
  const modalStyle = themeColors ? {
    backgroundColor: modalBg,
    color: modalText,
    fontFamily: themeFont || 'inherit', zIndex: 55
  } : {};
  
  const buttonStyle = themeColors ? {
    backgroundColor: modalPrimary,
    color: modalBg,
    fontFamily: themeFont || 'inherit'
  } : {};
  
  const outlineButtonStyle = themeColors ? {
    borderColor: modalPrimary,
    color: modalPrimary,
    fontFamily: themeFont || 'inherit'
  } : {};
  
  const inputStyle = themeColors ? {
    borderColor: modalBorder,
    backgroundColor: themeColors?.cardBg || modalBg,
    color: modalText,
    fontFamily: themeFont || 'inherit'
  } : {};

  return (
    <Dialog open={shouldOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md" 
        style={{
          ...modalStyle,
          backgroundColor: modalBg,
          color: modalText,
          fontFamily: themeFont || 'inherit'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold" style={{ color: themeColors?.text || 'inherit' }}>Contact {businessName}</DialogTitle>
          <DialogDescription className="sr-only">Send a message to {businessName}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <label htmlFor="name" className="text-sm font-medium">
                {t("Full Name")}
              </label>
            </div>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              style={inputStyle}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <label htmlFor="email" className="text-sm font-medium">
                {t("Email Address")}
              </label>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              style={inputStyle}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <label htmlFor="phone" className="text-sm font-medium">
                {t("Phone Number")}
              </label>
            </div>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("Your phone number")}
              style={inputStyle}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <label htmlFor="message" className="text-sm font-medium">
                {t("Message")}
              </label>
            </div>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("How can we help you?")}
              rows={4}
              required
              style={inputStyle}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={processing} style={outlineButtonStyle}>
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={processing} style={buttonStyle}>
              {processing ? t('Sending...') : t('Send Message')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}