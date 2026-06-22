import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Music, Ticket, Globe, Mail, Phone, Users, Star, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getEventTemplate } from '../../event-templates';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface MusicFestivalTemplateProps {
  data: any;
  template: any;
}

export default function MusicFestivalTemplate({ data, template }: MusicFestivalTemplateProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#8b5cf6', secondary: '#a78bfa', text: '#1f2937' };
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const allSections = getEventTemplate('music-festival')?.sections || [];
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  
  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey);
    if (!sectionData || Object.keys(sectionData).length === 0 || !isSectionEnabled(templateConfig, sectionKey)) return null;
    
    switch (sectionKey) {
      case 'event_info':
        return renderEventInfo(sectionData);
      case 'venue':
        return renderVenue(sectionData);
      case 'lineup':
        return renderLineup(sectionData);
      case 'schedule':
        return renderSchedule(sectionData);
      case 'amenities':
        return renderAmenities(sectionData);
      case 'tickets':
        return renderTickets(sectionData);
      case 'contact':
        return renderContact(sectionData);
      case 'qr_share':
        return renderQrShare(sectionData);
      case 'design':
        return null; // Design section is handled in renderEventInfo
      default:
        return null;
    }
  };

  const renderEventInfo = (eventInfo: any) => {
    const design = configSections.design || {};
    const hasBackgroundImage = design.background_image;
    
    return (
      <div className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`} style={{ 
        background: hasBackgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${getImageDisplayUrl(design.background_image)})`
          : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        backgroundSize: hasBackgroundImage ? 'cover' : 'auto',
        backgroundPosition: hasBackgroundImage ? 'center' : 'initial'
      }}>
        {/* Animated Music Notes */}
        {!hasBackgroundImage && (
          <>
            <div className="absolute inset-0 opacity-15">
              <svg width="100%" height="100%" viewBox="0 0 200 200" className="fill-current text-white">
                <defs>
                  <pattern id="music-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20 Q10 10 20 20 T40 20" fill="none" stroke="currentColor" strokeWidth="1">
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 5,2; 0,0; -5,-2; 0,0"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <circle cx="20" cy="20" r="1" fill="currentColor">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#music-pattern)" />
              </svg>
            </div>
            {/* Floating Music Notes */}
            <div className="absolute text-white/50 inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + i * 0.3}s`,
                  }}
                >
                  {i % 3 === 0 ? '♪' : i % 3 === 1 ? '♫' : '♬'}
                </div>
              ))}
            </div>
          </>
        )}
      
        <div className="relative p-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold mb-4 animate-pulse" 
               style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <Music className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
            {eventInfo.genre || t('Music Festival')}
          </div>
          
          <h1 className="text-2xl font-bold mb-3 text-white leading-tight transform hover:scale-105 transition-transform duration-300">
            {eventInfo.festival_name || t('Music Festival')}
          </h1>
          
          {eventInfo.festival_description && (
            <p className="text-sm text-white/90 mb-4 leading-relaxed max-w-sm mx-auto">
              {eventInfo.festival_description}
            </p>
          )}
          
          {(eventInfo.start_date || eventInfo.end_date || eventInfo.start_time) && (
            <div className="flex items-center justify-center space-x-4 text-white/90">
              {eventInfo.start_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {(() => {
                      try {
                        return window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(eventInfo.start_date, false) : new Date(eventInfo.start_date).toLocaleDateString();
                      } catch {
                        return eventInfo.start_date;
                      }
                    })()}
                  </span>
                </div>
              )}
              {eventInfo.start_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {window.appSettings?.formatTime ? window.appSettings.formatTime(eventInfo.start_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${eventInfo.start_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${eventInfo.start_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                  </span>
                </div>
              )}
              {eventInfo.end_date && (
                <Badge variant="secondary" className="text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {t('Until')} {(() => {
                    try {
                      return window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(eventInfo.end_date, false) : new Date(eventInfo.end_date).toLocaleDateString();
                    } catch {
                      return eventInfo.end_date;
                    }
                  })()}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVenue = (venue: any) => (
    <div className="p-4">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: colors.primary }}></div>
        
        <div className="p-5">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                <MapPin className="w-7 h-7" style={{ color: colors.primary }} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                  {venue.venue_name || t('Festival Venue')}
                </h3>
                {venue.capacity && (
                  <div className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}>
                    {venue.capacity}
                  </div>
                )}
              </div>
              
              {venue.address && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {venue.address}
                </p>
              )}
              
              {venue.map_url && (
                <button
                  onClick={() => window.open(venue.map_url, '_blank')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('Get Directions')}</span>
                  <div className="w-1 h-1 rounded-full bg-white/50"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLineup = (lineup: any) => {
    if (!lineup.artist_list || lineup.artist_list.length === 0) return null;
    const artistCount = lineup.artist_list.length;
    
    return (
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed p-4" style={{ borderColor: `${colors.primary}30` }}>
          <h3 className="font-bold text-lg mb-3" style={{ color: colors.text }}>
            {t('Featured Artists')}
          </h3>
          
          <div className="grid gap-2">
            {lineup.artist_list.map((artist: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: `${colors.primary}20` }}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: colors.text }}>
                      {artist.artist_name}
                    </h4>
                    {artist.stage && (
                      <p className="text-xs" style={{ color: colors.primary }}>
                        {artist.stage}
                      </p>
                    )}
                  </div>
                </div>
                
                {artist.performance_time && (
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold" style={{ color: colors.secondary }}>
                      {window.appSettings?.formatTime ? window.appSettings.formatTime(artist.performance_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${artist.performance_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${artist.performance_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSchedule = (schedule: any) => {
    if (!schedule.daily_schedule || schedule.daily_schedule.length === 0) return null;
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Clock className="w-6 h-6 mr-3" style={{ color: colors.primary }} />
          <h3 className="font-bold text-lg" style={{ color: colors.text }}>
            {t('Festival Schedule')}
          </h3>
        </div>
        
        <div className="space-y-2">
          {schedule.daily_schedule.map((day: any, index: number) => (
            <div key={index} className="flex items-center p-3 rounded-lg border-l-4" 
                 style={{ backgroundColor: `${colors.primary}05`, borderColor: colors.primary }}>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm" style={{ color: colors.primary }}>
                    {day.date && (() => {
                      try {
                        return window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(day.date, false) : new Date(day.date).toLocaleDateString();
                      } catch {
                        return day.date;
                      }
                    })()}
                  </h4>
                  <span className="text-xs font-medium px-2 py-1 rounded" 
                        style={{ backgroundColor: colors.primary, color: 'white' }}>
                    {day.start_time} - {day.end_time}
                  </span>
                </div>
                {day.special_events && (
                  <p className="text-xs mt-1" style={{ color: colors.secondary }}>
                    {day.special_events}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAmenities = (amenities: any) => {
    if (!amenities.amenity_list || amenities.amenity_list.length === 0) return null;
    return (
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed p-4" style={{ borderColor: `${colors.primary}30` }}>
          <h3 className="font-bold text-lg mb-3" style={{ color: colors.text }}>
            {t('Festival Amenities')}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {amenities.amenity_list.map((amenity: any, index: number) => (
              <div key={index} className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium" 
                   style={{ backgroundColor: `${colors.primary}10`, color: colors.primary, border: `1px solid ${colors.primary}30` }}>
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.secondary }}></div>
                <span>{amenity.amenity_name}</span>

              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTickets = (tickets: any) => {
    if (!tickets.ticket_url) return null;
    return (
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl" style={{ 
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 4s ease-in-out infinite'
        }}>
          <style jsx>{`
            @keyframes gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 animate-spin" style={{ animationDuration: '8s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="white" />
              <path d="M30 50 L70 50 M50 30 L50 70" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
          
          <div className="relative p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white">{t('Get Tickets')}</h3>
              <Ticket className="w-6 h-6 text-white animate-bounce" style={{ animationDuration: '1.5s' }} />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {tickets.general_admission && (
                <div className="rounded-lg p-2 text-center border border-white/50">
                  <div className="text-xs text-white/80">{t('General')}</div>
                  <div className="text-lg font-bold text-white">{tickets.general_admission}</div>
                </div>
              )}
              {tickets.vip_price && (
                <div className="rounded-lg p-2 text-center border border-white/50">
                  <div className="text-xs text-white/80">{t('VIP')} 👑</div>
                  <div className="text-lg font-bold text-white">{tickets.vip_price}</div>
                </div>
              )}
              {tickets.early_bird_price && (
                <div className="rounded-lg p-2 text-center border border-white/50">
                  <div className="text-xs text-white/80">{t('Early')} ⚡</div>
                  <div className="text-lg font-bold text-white">{tickets.early_bird_price}</div>
                </div>
              )}
            </div>
            
            {tickets.sale_deadline && (
              <div className="bg-white/10 rounded-lg p-2 mb-3 text-center">
                <span className="text-xs text-white/90">
                  ⏰ {t('Ends')}: {(() => {
                    try {
                      return window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(tickets.sale_deadline, false) : new Date(tickets.sale_deadline).toLocaleDateString();
                    } catch {
                      return tickets.sale_deadline;
                    }
                  })()}
                </span>
              </div>
            )}
            
            <button 
              className="w-full bg-white font-bold py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg cursor-pointer"
              style={{ color: colors.primary }}
              onClick={() => window.open(tickets.ticket_url, '_blank')}
            >
              <span className="animate-pulse">🎫</span> {t('Buy Now')}
            </button>
          </div>
        </div>
      </div>
    );
  };



  const renderContact = (contact: any) => {
    if (!contact.organizer_name && !contact.email && !contact.phone && !contact.website && !contact.social_media) return null;
    return (
      <div className="p-4">
        <div className="bg-gradient-to-br rounded-xl p-4" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)` }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: colors.text }}>
                {t('Contact Information')}
              </h3>
              {contact.organizer_name && (
                <p className="text-sm" style={{ color: colors.primary }}>
                  {t('Organizer')}: {contact.organizer_name}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex flex-col items-center p-3 rounded-lg bg-white/50">
                <Mail className="w-5 h-5 mb-1" style={{ color: colors.primary }} />
                <span className="text-xs font-medium truncate max-w-full" style={{ color: colors.text }}>{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex flex-col items-center p-3 rounded-lg bg-white/50">
                <Phone className="w-5 h-5 mb-1" style={{ color: colors.primary }} />
                <span className="text-xs font-medium" style={{ color: colors.text }}>{contact.phone}</span>
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" className="flex flex-col items-center p-3 rounded-lg bg-white/50">
                <Globe className="w-5 h-5 mb-1" style={{ color: colors.primary }} />
                <span className="text-xs font-medium truncate max-w-full" style={{ color: colors.text }}>{contact.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {contact.social_media && (
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/50">
                <Music className="w-5 h-5 mb-1" style={{ color: colors.primary }} />
                <span className="text-xs font-medium truncate max-w-full" style={{ color: colors.text }}>{contact.social_media}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQrShare = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl" style={{ 
          backgroundColor: colors.secondary
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <Music className="w-full h-full animate-pulse" />
          </div>
          
          <div className="relative p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">
              {qrData.qr_title || t('Share Festival')}
            </h3>
            
            {qrData.qr_description && (
              <p className="text-sm text-white/90 mb-4">
                {qrData.qr_description}
              </p>
            )}
            
            <Button 
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-6 py-2 rounded-full hover:bg-white/30 transition-all"
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openQrModal'))}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {t('Share QR Code')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const orderedSectionKeys = getSectionOrder(templateConfig, allSections)
    .filter(key => key !== 'colors');

  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;
  
  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl" style={{ 
      backgroundColor: hasBackgroundImage ? 'transparent' : '#f8fafc',
      backgroundImage: hasBackgroundImage ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.05)), url(${getImageDisplayUrl(design.background_image)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}


    </div>
  );
}