import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MenuPreview from '../components/MenuPreview';

const syncPreviewProps = (previewData: any) => {
  if (!previewData?.base_url && !previewData?.image_url) return;

  (window as any).page ??= {};
  (window as any).page.props ??= {};
  (window as any).page.props.globalSettings ??= {};

  if (previewData.base_url) (window as any).page.props.base_url = previewData.base_url;
  if (previewData.image_url) (window as any).page.props.image_url = previewData.image_url;
  if (previewData.storage_type) {
    (window as any).page.props.storage_type = previewData.storage_type;
    (window as any).page.props.globalSettings.storage_type = previewData.storage_type;
  }
};

export default function MenuPreviewPage() {
  const { t } = useTranslation();
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const data = localStorage.getItem('menu_preview_data');
    
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        syncPreviewProps(parsedData);
        setPreviewData(parsedData);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500">{t('Loading preview...')}</p>
        </div>
      </div>
    );
  }
  
  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">{t('No preview data found')}</h1>
          <p className="text-gray-500">{t('Please go back and try again')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{previewData.name || t('Menu Preview')}</title>
      </Head>
      
      <MenuPreview data={{
        name: previewData.name || t('Preview Menu'),
        menu_type: previewData.menu_type || 'cafe',
        config_sections: previewData.config_sections || {}
      }} menuType={previewData.menu_type || 'cafe'} />
    </>
  );
}