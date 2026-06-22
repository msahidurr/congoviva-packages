import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Campaign {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  business: {
    id: number;
    name: string;
    slug: string;
    url_prefix?: string;
    custom_domain?: string;
  };
}

interface ActiveCampaignsSectionProps {
  campaigns: Campaign[];
  settings: any;
  sectionData: any;
  brandColor: string;
}

export default function ActiveCampaignsSection({ 
  campaigns, 
  settings, 
  sectionData, 
  brandColor 
}: ActiveCampaignsSectionProps) {
  if (!campaigns || campaigns.length === 0) {
    return null;
  }
  
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const layout = sectionData?.layout || 'grid';
  const columns = sectionData?.columns || 3;
  const maxDisplay = sectionData?.max_display || 6;
  const showViewAll = sectionData?.show_view_all || false;
  const backgroundColor = sectionData?.background_color || '#f8fafc';
  const backgroundImage = sectionData?.background_image ? getImageDisplayUrl(sectionData.background_image) : null;
  const overlay = sectionData?.overlay || false;
  const overlayColor = sectionData?.overlay_color || 'rgba(0,0,0,0.5)';
  
  const displayedCampaigns = campaigns.slice(0, maxDisplay);
  const hasMoreCampaigns = campaigns.length > maxDisplay;

  // Auto-slide functionality for slider layout
  useEffect(() => {
    if (layout === 'slider' && campaigns.length > columns) {
      const interval = setInterval(() => {
        if (isAutoPlaying) {
          setCurrentSlide((prev) => 
            prev + 1 >= Math.ceil(Math.min(campaigns.length, maxDisplay) / columns) ? 0 : prev + 1
          );
        }
      }, 4000); // Auto-slide every 4 seconds
      
      return () => clearInterval(interval);
    }
  }, [layout, columns, isAutoPlaying, maxDisplay, campaigns.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getBusinessUrl = (business: Campaign['business']) => {
    return business.custom_domain 
      ? `https://${business.custom_domain}`
      : (business.url_prefix && business.url_prefix !== '' 
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: business.slug }, true)
        : route('public.vcard.show.direct', business.slug, true));
  };

  const title = sectionData?.title || 'Featured Business Promotions';
  const subtitle = sectionData?.subtitle || 'Explore businesses we\'re currently promoting and discover amazing services';

  const getGridColumns = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev + 1 >= Math.ceil(displayedCampaigns.length / columns) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev - 1 < 0 ? Math.ceil(displayedCampaigns.length / columns) - 1 : prev - 1
    );
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const daysRemaining = getDaysRemaining(campaign.end_date);
    const businessUrl = getBusinessUrl(campaign.business);

    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {campaign.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 min-h-[4.5rem]">
                {campaign.description}
              </p>
            </div>
            {daysRemaining > 0 && (
              <div 
                className="px-2 py-1 rounded-full text-xs font-medium text-white flex-shrink-0 ml-2"
                style={{ backgroundColor: brandColor }}
              >
                {daysRemaining} {t('days left')}
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="font-medium truncate">{campaign.business.name}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
            </div>
            
            {daysRemaining > 0 && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{t('Ends in')} {daysRemaining} {t('day', { count: daysRemaining })}</span>
              </div>
            )}
          </div>

          <Button
            className="w-full group-hover:shadow-md transition-shadow mt-auto"
            style={{ backgroundColor: brandColor }}
            onClick={() => window.open(businessUrl, '_blank', 'noopener,noreferrer')}
          >
            <span>{t('Visit Business')}</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  const ListCard = ({ campaign }: { campaign: Campaign }) => {
    const daysRemaining = getDaysRemaining(campaign.end_date);
    const businessUrl = getBusinessUrl(campaign.business);

    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {campaign.name}
                </h3>
                {daysRemaining > 0 && (
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white ml-4"
                    style={{ backgroundColor: brandColor }}
                  >
                    {daysRemaining} {t('days left')}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {campaign.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">{campaign.business.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
                </div>
                
                {daysRemaining > 0 && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{t('Ends in')} {daysRemaining} {t('day', { count: daysRemaining })}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              className="ml-6 group-hover:shadow-md transition-shadow"
              style={{ backgroundColor: brandColor }}
              onClick={() => window.open(businessUrl, '_blank', 'noopener,noreferrer')}
            >
              <span>{t('Visit Business')}</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLayout = () => {
    switch (layout) {
      case 'list':
        return (
          <div className="space-y-4">
            {displayedCampaigns.map((campaign) => (
              <ListCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        );
        
      case 'carousel':
        const totalSlides = Math.ceil(displayedCampaigns.length / columns);
        const startIndex = currentSlide * columns;
        const endIndex = startIndex + columns;
        const visibleCampaigns = displayedCampaigns.slice(startIndex, endIndex);
        
        return (
          <div className="relative">
            <div className={`grid ${getGridColumns()} gap-6`}>
              {visibleCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
            
            {totalSlides > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="p-2 hover:bg-gray-100"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        currentSlide === index 
                          ? 'scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: currentSlide === index ? brandColor : '#d1d5db'
                      }}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="p-2 hover:bg-gray-100"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'slider':
        const sliderTotalSlides = Math.ceil(displayedCampaigns.length / columns);
        const sliderStartIndex = currentSlide * columns;
        const sliderEndIndex = sliderStartIndex + columns;
        const sliderVisibleCampaigns = displayedCampaigns.slice(sliderStartIndex, sliderEndIndex);
        
        return (
          <div 
            className="relative overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Slider Container with Smooth Transition */}
            <div className="relative">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: sliderTotalSlides }).map((_, slideIndex) => {
                  const slideStart = slideIndex * columns;
                  const slideEnd = slideStart + columns;
                  const slideCampaigns = displayedCampaigns.slice(slideStart, slideEnd);
                  
                  return (
                    <div key={slideIndex} className={`flex-shrink-0 w-full grid ${getGridColumns()} gap-6`}>
                      {slideCampaigns.map((campaign) => (
                        <div key={campaign.id} className="transform transition-all duration-500 hover:scale-105">
                          <CampaignCard campaign={campaign} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Modern Dot Indicators */}
            {sliderTotalSlides > 1 && (
              <div className="flex justify-center items-center mt-8">
                <div className="flex gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  {Array.from({ length: sliderTotalSlides }).map((_, index) => (
                    <button
                      key={index}
                      className={`transition-all duration-300 rounded-full ${
                        currentSlide === index 
                          ? 'w-8 h-3' 
                          : 'w-3 h-3 hover:scale-125'
                      }`}
                      style={{ 
                        backgroundColor: currentSlide === index ? brandColor : '#cbd5e1',
                        opacity: currentSlide === index ? 1 : 0.6
                      }}
                      onClick={() => {
                        setCurrentSlide(index);
                        setIsAutoPlaying(false);
                        setTimeout(() => setIsAutoPlaying(true), 3000);
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default: // grid
        return (
          <div className={`grid ${getGridColumns()} gap-6`}>
            {displayedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        );
    }
  };

  return (
    <section 
      className="py-16 relative"
      style={{ backgroundColor }}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {overlay && (
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor }}
            />
          )}
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: brandColor }}
          >
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {renderLayout()}

        {showViewAll && hasMoreCampaigns && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="hover:shadow-md transition-shadow"
              style={{ borderColor: brandColor, color: brandColor }}
            >
              {t('View All Campaigns')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}