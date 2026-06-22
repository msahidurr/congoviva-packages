import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import { useFavicon } from '@/hooks/use-favicon';

interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  sort_order: number;
}

interface CustomPageData {
  id: number;
  title: string;
  slug: string;
}

interface PageProps {
  page: CustomPage;
  customPages: CustomPageData[];
  settings: {
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    title?: string;
    description?: string;
    config_sections?: {
      sections?: Array<{
        key: string;
        [key: string]: any;
      }>;
      theme?: {
        primary_color: string;
        secondary_color: string;
        accent_color: string;
      };
    };
    [key: string]: any;
  };
}

export default function CustomPage() {
  // Custom CSS to fix styling issues and maintain proper content formatting
  const customCSS = `
    /* Content Typography */
    .custom-page-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.7;
      color: #374151;
    }
    
    .custom-page-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #111827;
      line-height: 1.2;
    }
    
    .custom-page-content h2 {
      font-size: 2rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #111827;
      line-height: 1.3;
    }
    
    .custom-page-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #111827;
    }
    
    .custom-page-content p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .custom-page-content ul, .custom-page-content ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }
    
    .custom-page-content li {
      margin-bottom: 0.5rem;
    }
    
    .custom-page-content a {
      color: var(--primary-color);
      text-decoration: underline;
    }
    
    .custom-page-content a:hover {
      opacity: 0.8;
    }
    
    .custom-page-content blockquote {
      border-left: 4px solid var(--primary-color);
      padding-left: 1rem;
      margin: 1.5rem 0;
      font-style: italic;
      background-color: #f9fafb;
      padding: 1rem;
    }
    
    .custom-page-content code {
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.875rem;
    }
    
    .custom-page-content pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
    }
    
    .custom-page-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
    
    .custom-page-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    
    .custom-page-content th, .custom-page-content td {
      border: 1px solid #d1d5db;
      padding: 0.75rem;
      text-align: left;
    }
    
    .custom-page-content th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    
    /* Fix form inputs */
    .custom-page-content input:focus, 
    .custom-page-content textarea:focus {
      --tw-ring-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
    }
    
    /* Fix color issues */
    .custom-page-content .bg-blue-50 { background-color: rgba(var(--primary-color-rgb), 0.1) !important; }
    .custom-page-content .bg-purple-50 { background-color: rgba(var(--secondary-color-rgb), 0.1) !important; }
    .custom-page-content .bg-green-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
    .custom-page-content .bg-red-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
    
    .custom-page-content .text-blue-600 { color: var(--primary-color) !important; }
    .custom-page-content .text-purple-600 { color: var(--secondary-color) !important; }
    .custom-page-content .text-green-600 { color: var(--accent-color) !important; }
    .custom-page-content .text-red-600 { color: var(--accent-color) !important; }
    
    .custom-page-content .border-blue-500 { border-color: var(--primary-color) !important; }
    .custom-page-content .border-purple-500 { border-color: var(--secondary-color) !important; }
    .custom-page-content .border-green-500 { border-color: var(--accent-color) !important; }
    .custom-page-content .border-red-500 { border-color: var(--accent-color) !important; }
    
    .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
    .custom-page-content .bg-purple-600 { background-color: var(--secondary-color) !important; }
    .custom-page-content .bg-green-600 { background-color: var(--accent-color) !important; }
    .custom-page-content .bg-red-500 { background-color: var(--accent-color) !important; }
    
    /* Fix border colors */
    .custom-page-content .border-blue-200 { border-color: rgba(var(--primary-color-rgb), 0.2) !important; }
    .custom-page-content .border-green-200 { border-color: rgba(var(--accent-color-rgb), 0.2) !important; }
    
    /* Fix hover states */
    .custom-page-content .hover\\:bg-blue-700:hover { background-color: var(--primary-color) !important; opacity: 0.9; }
    
    /* Fix form button */
    .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
  `;
  
  const pageProps = usePage().props as any;
  const { page, customPages = [], settings } = pageProps;
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#3b82f6';
  const secondaryColor = settings?.config_sections?.theme?.secondary_color || '#8b5cf6';
  const accentColor = settings?.config_sections?.theme?.accent_color || '#10b77f';
  
  useFavicon();
  
  return (
    <>
      <Head>
        <title>{page.meta_title || page.title}</title>
        {page.meta_description && (
          <meta name="description" content={page.meta_description} />
        )}

        <style>{customCSS}</style>
      </Head>
      
      <div 
        className="min-h-screen bg-white" 
        style={{ 
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
          '--accent-color': accentColor,
          '--primary-color-rgb': primaryColor.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ') || '59, 130, 246',
          '--secondary-color-rgb': secondaryColor.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ') || '139, 92, 246',
          '--accent-color-rgb': accentColor.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ') || '16, 185, 129'
        } as React.CSSProperties}
      >
        <Header 
          settings={settings} 
          customPages={customPages}
          directoryCustomPages={customPages}
          isDirectoryContext={true}
          sectionData={settings?.config_sections?.sections?.find(s => s.key === 'header') || {}}
          brandColor={primaryColor}
        />
        
        <main className="pt-16 min-h-screen">
          <div className="custom-page-content" dangerouslySetInnerHTML={{ __html: page.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'") }} />
        </main>
        
        <Footer 
          settings={settings} 
          sectionData={settings?.config_sections?.sections?.find(s => s.key === 'footer') || {}} 
          brandColor={primaryColor}
        />
      </div>
    </>
  );
}