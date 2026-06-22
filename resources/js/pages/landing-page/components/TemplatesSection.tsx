import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';


interface Template {
  name: string;
  category: string;
}

interface TemplatesSectionProps {
  settings: any;
  sectionData: {
    title: string;
    subtitle: string;
    background_color: string;
    layout: string;
    columns: number;
    templates_list: Template[];
    cta_text: string;
    cta_link: string;
  };
  brandColor: string;
}

export default function TemplatesSection({ settings, sectionData, brandColor }: TemplatesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  
  const {
    title = 'Explore Our Templates',
    subtitle = 'Choose from our professionally designed templates to create your perfect digital business card.',
    background_color = '#f8fafc',
    layout = 'carousel', // Default to carousel
    columns = 3,
    templates_list = [],
    cta_text = 'View All Templates',
    cta_link = '#'
  } = sectionData || {};
  
  // Number of templates to show per slide
  const templatesPerSlide = 5;
  const totalSlides = Math.ceil(templates_list.length / templatesPerSlide);
  
  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  

  
  // Open preview in new tab
  const openPreview = (templateName: string) => {
    // Store the template data in localStorage for the preview page to use
    const templateData = getBusinessTemplate(templateName);
    localStorage.setItem('vcard_preview_data', JSON.stringify({
      business_type: templateName,
      name: templateData?.defaultData?.header?.name || 'Business Name',
      slug: 'preview',
      config_sections: templateData?.defaultData || {}
    }));
    
    // Open the preview in a new tab
    window.open(route('vcard.preview'), '_blank');
  };

  // Template card component with VCardPreview
  const TemplateCard = ({ template }: { template: Template }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative pt-[80%] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
          src={`${(window as any).baseUrl || window.location.origin}/storage/images/business-template/${template.name}.png`}
          alt={`${template.name} template`}
          className="absolute inset-0 w-full h-full object-top object-cover hover:object-bottom transition-all duration-4000"
          onError={(e) => {
            e.currentTarget.src = `${(window as any).baseUrl || window.location.origin}/storage/images/business-template/freelancer.png`;
          }}
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 capitalize leading-tight">
            {template.name.replace(/-/g, ' ')}
          </h3>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ml-2" 
            style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
          >
            {template.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {template.category === 'business' ? 'Professional business design' : 
           template.category === 'creative' ? 'Creative and unique layout' : 
           template.category === 'technology' ? 'Modern tech-focused style' : 
           template.category === 'sports' ? 'Dynamic sports-focused layout':
           'Professionally crafted template'}
        </p>
      </div>
    </div>
  );

  return (
    <section 
      id="templates" 
      className="py-16 md:py-24"
      style={{ backgroundColor: background_color }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {(layout === 'carousel' || layout === 'slider') && (
          <div className="relative mb-12">
            {totalSlides > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}
            
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  const slideTemplates = templates_list.slice(
                    slideIndex * templatesPerSlide, 
                    (slideIndex + 1) * templatesPerSlide
                  );
                  
                  return (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6">
                        {slideTemplates.map((template, index) => (
                          <TemplateCard key={`${slideIndex}-${index}`} template={template} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {totalSlides > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'w-8 bg-gray-800' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {layout === 'grid' && (
          // Grid layout
          <div className="mb-12">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {templates_list
                .filter(template => template && template.name)
                .map((template, index) => (
                  <TemplateCard key={index} template={template} />
                ))}
            </div>
          </div>
        )}

        {layout === 'list' && (
          <div className="mb-12">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {templates_list
                .filter(template => template && template.name)
                .map((template, index) => (
                  <TemplateCard key={index} template={template} />
                ))}
            </div>
          </div>
        )}

        {cta_text && (
          <div className="text-center">
            <Link
              href={route('template.index')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm hover:brightness-110 hover:!text-white transition-all duration-200"
              style={{ backgroundColor: brandColor }}
            >
              {cta_text}
            </Link>
          </div>
        )}
      </div>

    </section>
  );
}