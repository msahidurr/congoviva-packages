import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import VCardPreview from '@/pages/vcard-builder/components/VCardPreview';
import ContactFormModal from '@/components/ContactFormModal';
import AppointmentFormModal from '@/components/AppointmentFormModal';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useFavicon } from '@/hooks/use-favicon';
import { useTranslation } from 'react-i18next';

export default function VCardPreviewPage({ planFeatures: backendPlanFeatures }: { planFeatures?: any } = {}) {
  useFavicon();
  const { t } = useTranslation();
  const [previewData, setPreviewData] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  
  useEffect(() => {
    // Get the preview data from localStorage
    const storedData = localStorage.getItem('vcard_preview_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);

        setPreviewData(data);
        
        // Get the template based on the business type
        if (data.business_type) {
          const templateData = getBusinessTemplate(data.business_type);
          setTemplate(templateData);
        }
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
  }, []);
  
  // Listen for custom events from template buttons
  useEffect(() => {
    const handleOpenContactModal = (e: Event) => {
      setContactModalOpen(true);
    };
    const handleOpenAppointmentModal = (e: Event) => {
      setAppointmentModalOpen(true);
    };
    
    // Listen on multiple targets
    const targets = [window, document, document.body];
    targets.forEach(target => {
      target.addEventListener('openContactModal', handleOpenContactModal, true);
      target.addEventListener('openAppointmentModal', handleOpenAppointmentModal, true);
    });
    
    return () => {
      targets.forEach(target => {
        target.removeEventListener('openContactModal', handleOpenContactModal, true);
        target.removeEventListener('openAppointmentModal', handleOpenAppointmentModal, true);
      });
    };
  }, []);

  if (!previewData || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t("Loading Preview...")}</h1>
          <p className="text-gray-600">{t("If nothing loads, please go back and try again.")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title={`Preview: ${previewData.name || 'Business Card'}`} />
      
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-lg mx-auto py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <VCardPreview
              businessType={previewData.business_type}
              data={{ 
                name: previewData.name,
                slug: 'preview',
                business_type: previewData.business_type,
                config_sections: previewData.config_sections,
                template_config: { 
                  sections: previewData.config_sections, 
                  sectionSettings: previewData.config_sections,
                  allowedSections: previewData.template_config?.allowedSections,
                  planFeatures: backendPlanFeatures || previewData.template_config?.planFeatures
                }
              }}
              template={template}
            />
          </div>
        </div>
      </div>
      
      {/* Modals for Preview */}
      <ContactFormModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        businessId={0}
        businessName={previewData?.name || 'Preview Business'}
        themeColors={previewData?.config_sections?.colors || template?.defaultColors}
        themeFont={previewData?.config_sections?.font || template?.defaultFont}
      />
      
      <AppointmentFormModal 
        isOpen={appointmentModalOpen} 
        onClose={() => setAppointmentModalOpen(false)} 
        businessId={0}
        businessName={previewData?.name || 'Preview Business'}
        themeColors={previewData?.config_sections?.colors || template?.defaultColors}
        themeFont={previewData?.config_sections?.font || template?.defaultFont}
      />
    </>
  );
}