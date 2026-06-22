import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Palette, Ticket, Mail, Phone, Image, Brush, Frame, Sparkles, Clock, Users, Star, ArrowRight, QrCode } from 'lucide-react';
import { getSectionData } from '@/utils/sectionHelpers';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface ArtExhibitionTemplateProps {
  data: any;
  template: any;
}

export default function ArtExhibitionTemplate({ data, template }: ArtExhibitionTemplateProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#2563eb', secondary: '#64748b', text: '#1e293b' };
  
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const eventInfo = getSectionData(templateConfig, 'event_info') || {};
  const gallery = getSectionData(templateConfig, 'gallery') || {};
  const artworks = getSectionData(templateConfig, 'artworks') || {};
  const ticketPricing = getSectionData(templateConfig, 'ticket_pricing') || {};
  const admission = getSectionData(templateConfig, 'admission') || {};
  const qrShare = getSectionData(templateConfig, 'qr_share') || {};
  const contact = getSectionData(templateConfig, 'contact') || {};

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden" style={{ 
      backgroundColor: hasBackgroundImage ? 'transparent' : '#ffffff',
      backgroundImage: hasBackgroundImage ? `url(${getImageDisplayUrl(design.background_image)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      
      {/* Elegant Header */}
      <div className="relative overflow-hidden" style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative px-8 py-10 text-center text-white">
          <div className="w-16 h-16 mx-auto mb-8 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Palette className="w-8 h-8" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-extralight mb-2 tracking-wider leading-tight">
              {eventInfo.exhibition_title || t('Contemporary Visions')}
            </h1>
            
            {eventInfo.exhibition_type && (
              <div className="flex items-center justify-center">
                <div className="h-px w-8 bg-white/40"></div>
                <div className="mx-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <p className="text-base font-light tracking-wide">{eventInfo.exhibition_type}</p>
                </div>
                <div className="h-px w-8 bg-white/40"></div>
              </div>
            )}
            
            {eventInfo.description && (
              <div className="mt-6">
                <p className="text-base font-light text-white/90 leading-relaxed italic">
                  {eventInfo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Artist Section */}
      {eventInfo.artist_name && (
        <div className="mx-6 mb-4 rounded-2xl p-6 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="text-center mb-4">
            <div className="relative w-20 h-20 mx-auto mb-4">
              {design.featured_artist ? (
                <img src={getImageDisplayUrl(design.featured_artist)} alt={eventInfo.artist_name} 
                     className="w-full h-full rounded-2xl object-cover shadow-md" />
              ) : (
                <div className="w-full h-full rounded-2xl flex items-center justify-center shadow-md"
                     style={{ backgroundColor: colors.primary }}>
                  <Star className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                   style={{ backgroundColor: colors.secondary }}>
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>
              {t('Featured Artist')}
            </h3>
            <p className="text-xl font-medium text-gray-900">{eventInfo.artist_name}</p>
          </div>
          
          {/* Artist Information */}
          {getSectionData(templateConfig, 'artist_info') && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {getSectionData(templateConfig, 'artist_info').artist_bio && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: colors.secondary }}>{t('Biography')}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getSectionData(templateConfig, 'artist_info').artist_bio}
                  </p>
                </div>
              )}
              
              {getSectionData(templateConfig, 'artist_info').artist_statement && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: colors.secondary }}>{t('Artist Statement')}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getSectionData(templateConfig, 'artist_info').artist_statement}
                  </p>
                </div>
              )}
              
              {getSectionData(templateConfig, 'artist_info').previous_exhibitions && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: colors.secondary }}>{t('Previous Exhibitions')}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getSectionData(templateConfig, 'artist_info').previous_exhibitions}
                  </p>
                </div>
              )}
              
              {getSectionData(templateConfig, 'artist_info').artist_website && (
                <div className="text-center pt-2">
                  <a href={getSectionData(templateConfig, 'artist_info').artist_website} 
                     target="_blank" rel="noopener noreferrer"
                     className="inline-block px-4 py-2 rounded-full text-sm font-medium border-2 transition-all hover:shadow-md"
                     style={{ 
                       borderColor: colors.primary,
                       color: colors.primary,
                       backgroundColor: 'transparent'
                     }}>
                    {t('Visit Artist Website')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Exhibition Details */}
      <div className="bg-white">


        {gallery.gallery_name && (
          <div className="mx-6 mb-4 rounded-2xl p-6 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-md"
                   style={{ backgroundColor: colors.secondary }}>
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.primary }}>
                {t('Gallery & Location')}
              </h3>
              <div className="space-y-3">
                <p className="text-base font-medium text-gray-900">{gallery.gallery_name}</p>
                {gallery.address && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">{gallery.address}</p>
                    <button 
                      onClick={() => window.open(gallery.location_url || `https://maps.google.com/?q=${encodeURIComponent(gallery.address)}`, '_blank')}
                      className="cursor-pointer px-6 py-2 rounded-full text-sm font-medium border-2 transition-all hover:shadow-md"
                      style={{ 
                        borderColor: colors.secondary,
                        color: colors.secondary,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {t('View on Map')}
                    </button>
                  </div>
                )}
                {(gallery.opening_date || gallery.closing_date || gallery.opening_time || gallery.closing_time) && (
                  <div className="mt-4 space-y-2">
                    {gallery.opening_date && (
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                        <p className="text-sm font-medium" style={{ color: colors.primary }}>
                          {t('Start')}: {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(gallery.opening_date, false) : new Date(gallery.opening_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {gallery.opening_time && (
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-4 h-4" style={{ color: colors.secondary }} />
                        <p className="text-sm font-medium" style={{ color: colors.secondary }}>
                          {t('Time')}: {window.appSettings?.formatTime ? window.appSettings.formatTime(gallery.opening_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${gallery.opening_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${gallery.opening_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                        </p>
                      </div>
                    )}
                    {gallery.closing_date && (
                      <p className="text-sm font-medium" style={{ color: colors.primary }}>
                        {t('End Date')}: {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(gallery.closing_date, false) : new Date(gallery.closing_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </div>



      {/* Featured Artworks */}
      {artworks.artwork_list && artworks.artwork_list.length > 0 && (
        <div className="px-6 py-6" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: colors.primary }}>
              <Image className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Featured Works')}</h3>
          </div>
          
          <div className="space-y-4">
            {artworks.artwork_list.slice(0, 3).map((artwork: any, index: number) => (
              <div key={index} className="rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
                <div className="flex items-start space-x-3">

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{artwork.title}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      {artwork.year && (
                        <span className="text-sm font-medium" style={{ color: colors.primary }}>
                          {artwork.year}
                        </span>
                      )}
                      {artwork.medium && (
                        <span className="text-xs px-2 py-1 rounded-full" 
                              style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}>
                          {artwork.medium}
                        </span>
                      )}
                    </div>
                    {artwork.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {artwork.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {artworks.artwork_list.length > 3 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                +{artworks.artwork_list.length - 3} {t('more works in exhibition')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ticket Pricing */}
      {(ticketPricing.ticket_price || ticketPricing.booking_link) && (
        <div className="mx-6 mb-4 rounded-2xl p-6 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-md"
                 style={{ backgroundColor: colors.primary }}>
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
              {t('Event Tickets')}
            </h3>
          </div>
          
          <div className="space-y-3 mb-4">
            {ticketPricing.ticket_price && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t('Regular Price')}</span>
                <span className="text-lg font-bold" style={{ color: colors.primary }}>
                  {ticketPricing.ticket_price}
                </span>
              </div>
            )}
            
            {ticketPricing.early_bird_price && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t('Early Bird')}</span>
                <span className="text-lg font-bold" style={{ color: colors.secondary }}>
                  {ticketPricing.early_bird_price}
                </span>
              </div>
            )}
            
            {ticketPricing.group_discount && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t('Group Discount')}</span>
                <span className="text-sm font-medium" style={{ color: colors.secondary }}>
                  {ticketPricing.group_discount}
                </span>
              </div>
            )}
          </div>
          
          {ticketPricing.booking_link && (
            <button 
              onClick={() => window.open(ticketPricing.booking_link, '_blank')}
              className="w-full px-4 py-2 rounded-full text-white font-medium text-sm transition-all hover:shadow-md cursor-pointer"
              style={{ backgroundColor: colors.primary }}
            >
              {t('Purchase Tickets')}
            </button>
          )}
        </div>
      )}

      {/* Contact Section */}
      {(contact.email || contact.phone) && (
        <div className="mx-6 mb-4 rounded-2xl p-6 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: colors.primary }}>
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('Contact')}</h3>
            </div>
            
            {contact.gallery_contact && (
              <p className="font-medium text-gray-700 mb-3">{contact.gallery_contact}</p>
            )}
            
            <div className="space-y-2">
              {contact.email && (
                <a href={`mailto:${contact.email}`} 
                   className="flex items-center space-x-3 p-3 rounded-xl hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{contact.email}</span>
                </a>
              )}
              
              {contact.phone && (
                <a href={`tel:${contact.phone}`} 
                   className="flex items-center space-x-3 p-3 rounded-xl hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{contact.phone}</span>
                </a>
              )}
              
              {contact.website && (
                <a href={contact.website} target="_blank" rel="noopener noreferrer"
                   className="flex items-center space-x-3 p-3 rounded-xl hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{t('Visit Gallery Website')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Share - Art Exhibition Style */}
      {qrShare.enable_qr && (
        <div className="mx-6 mb-4 rounded-2xl shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="relative overflow-hidden rounded-2xl p-6" style={{ 
            background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
          }}>
            {/* Artistic Pattern Background */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current" style={{ color: colors.primary }}>
                <defs>
                  <pattern id="art-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3">
                      <animate attributeName="r" values="1;2;1" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#art-pattern)" />
              </svg>
            </div>
            
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" 
                   style={{ backgroundColor: colors.primary }}>
                <QrCode className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                {qrShare.qr_title || t('Exhibition QR Code')}
              </h3>
              
              {qrShare.qr_description ? (
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {qrShare.qr_description}
                </p>
              ) : (
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {t('Download or share this QR code to let visitors access exhibition details instantly')}
                </p>
              )}
              
              <div className="space-y-3">
                <Button 
                  className="w-full px-6 py-3 rounded-2xl text-white font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      const event = new CustomEvent('openQrModal');
                      window.dispatchEvent(event);
                    }
                  }}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  {t('Download & Share QR Code')}
                </Button>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                  <span>{t('Share exhibition with art enthusiasts')}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}