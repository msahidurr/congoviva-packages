import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import BioLinkPreview from '../link-bio-builder/components/BioLinkPreview';


export default function BioLinkPreviewPage() {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get preview data from localStorage
    const data = localStorage.getItem('biolink_preview_data');
    
    if (data) {
      try {
        const parsedData = JSON.parse(data);
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
          <p className="text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }
  
  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">No preview data found</h1>
          <p className="text-gray-500">Please go back and try again</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{previewData.name || 'Bio Link Preview'}</title>
      </Head>
      
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-md">
          <BioLinkPreview data={{ 
            name: previewData.name || 'Bio Link',
            slug: previewData.slug || 'biolink',
            link_type: previewData.link_type || 'personal',
            config: previewData.config || {
              theme: 'personal',
              preset: 1,
              background: {
                type: 'color',
                color: '#ffffff',
                gradient: '',
                image: ''
              },
              buttonColor: '#000000',
              buttonTextColor: '#ffffff',
              textColor: '#000000',
              font: 'Inter',
              header: {
                name: 'User',
                tagline: '',
                profile_image: ''
              }
            }
          }} isPublic={true} />
        </div>
      </div>
    </>
  );
}