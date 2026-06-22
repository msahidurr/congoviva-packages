import React from 'react';
import { Calendar, Clock, MapPin, User, Users, Ticket, Globe, Mail, Phone, ExternalLink, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getEventTemplate } from '../../event-templates';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface ConferenceTemplateProps {
  data: any;
  template: any;
}

export default function ConferenceTemplate({ data, template }: ConferenceTemplateProps) {
  const { t, i18n } = useTranslation();
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#1e40af', secondary: '#3b82f6', text: '#1f2937' };
  
  // Get all sections for this event type
  const allSections = getEventTemplate('conference')?.sections || [];
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  
  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey);
    if (!sectionData || Object.keys(sectionData).length === 0 || !isSectionEnabled(templateConfig, sectionKey)) return null;
    
    switch (sectionKey) {
      case 'event_info':
        return renderEventInfo(sectionData);
      case 'venue':
        return renderVenue(sectionData);
      case 'agenda':
        return renderAgenda(sectionData);
      case 'speakers':
        return renderSpeakers(sectionData);
      case 'registration':
        return renderRegistration(sectionData);
      case 'contact':
        return renderContact(sectionData);
      case 'qr_share':
        return renderQrShare(sectionData);
      default:
        return null;
    }
  };

  const renderEventInfo = (eventInfo: any) => {
    const design = configSections.design || {};
    const hasBackgroundImage = design.background_image;
    
    return (
      <div className="relative overflow-hidden" style={{ 
        background: hasBackgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))`
          : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}>
        {/* Tech Pattern Background - only show if no background image */}
        {!hasBackgroundImage && (
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-white">
              <defs>
                <pattern id="tech-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  <circle cx="0" cy="0" r="1" fill="currentColor"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tech-grid)" />
            </svg>
          </div>
        )}
      
      <div className="relative p-6 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
          {eventInfo.event_badge || eventInfo.event_title || t('TECH CONFERENCE 2025')}
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-white leading-tight">
          {eventInfo.event_title || t('Innovation Summit')}
        </h1>
        
        {eventInfo.event_description && (
          <p className="text-sm text-white/90 mb-4 leading-relaxed max-w-sm mx-auto">
            {eventInfo.event_description}
          </p>
        )}
        
        {(eventInfo.event_date || eventInfo.event_time) && (
          <div className="flex items-center justify-center space-x-4 text-white/90">
            {eventInfo.event_date && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(eventInfo.event_date, false) : new Date(eventInfo.event_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {eventInfo.event_time && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {window.appSettings?.formatTime ? window.appSettings.formatTime(eventInfo.event_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${eventInfo.event_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${eventInfo.event_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                </span>
              </div>
            )}
            {eventInfo.duration && (
              <Badge variant="secondary" className="text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {eventInfo.duration}
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
      <div className="bg-white rounded-xl shadow-sm border p-4" style={{ borderColor: colors.primary + '20' }}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
            <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>
              {venue.venue_name || t('Conference Center')}
            </h3>
            {venue.address && (
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                {venue.address}
              </p>
            )}
            {venue.map_url && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs"
                style={{ borderColor: colors.primary, color: colors.primary }}
                onClick={() => window.open(venue.map_url, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {t('View Map')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgenda = (agenda: any) => {
    if (!agenda.schedule_items || agenda.schedule_items.length === 0) return null;
    return (
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center" style={{ color: colors.text }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2" style={{ backgroundColor: colors.primary + '15' }}>
            <Clock className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
          {t('Event Schedule')}
        </h3>
        <div className="space-y-3">
          {agenda.schedule_items.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-3" style={{ borderColor: colors.primary + '10' }}>
              <div className="flex items-start space-x-3">
                <div className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                  {item.time && (window.appSettings?.formatTime ? window.appSettings.formatTime(item.time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${item.time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${item.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}))}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1" style={{ color: colors.text }}>
                    {item.title}
                  </h4>
                  {item.speaker && (
                    <p className="text-xs font-medium mb-1" style={{ color: colors.primary }}>
                      {t('by')} {item.speaker}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSpeakers = (speakers: any) => {
    if (!speakers.speaker_list || speakers.speaker_list.length === 0) return null;
    return (
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center" style={{ color: colors.text }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2" style={{ backgroundColor: colors.primary + '15' }}>
            <Users className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
          {t('Featured Speakers')}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {speakers.speaker_list.slice(0, 2).map((speaker: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-3" style={{ borderColor: colors.primary + '10' }}>
              <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: colors.primary }}>
                  {speaker.photo ? (
                    <img
                      src={getImageDisplayUrl(speaker.photo)}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg" style={{ display: speaker.photo ? 'none' : 'flex' }}>
                    {speaker.name ? speaker.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm" style={{ color: colors.text }}>
                    {speaker.name}
                  </h4>
                  <p className="text-xs" style={{ color: colors.primary }}>
                    {speaker.title} {speaker.company && `at ${speaker.company}`}
                  </p>
                  {speaker.bio && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                      {speaker.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRegistration = (registration: any) => {
    if (!registration.registration_url) return null;
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r rounded-xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}>
          <h3 className="font-bold text-sm text-white mb-2">{t('Secure Your Spot')}</h3>
          <div className="flex items-center justify-center space-x-4 mb-3">
            {registration.ticket_price && (
              <div className="text-center">
                <div className="text-lg font-bold text-white">{registration.ticket_price}</div>
                <div className="text-xs text-white/80">{t('Regular')}</div>
              </div>
            )}
            {registration.early_bird_price && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-300">{registration.early_bird_price}</div>
                <div className="text-xs text-white/80">{t('Early Bird')}</div>
              </div>
            )}
          </div>
          <Button 
            className="w-full font-semibold"
            style={{ backgroundColor: 'white', color: colors.primary }}
            onClick={() => window.open(registration.registration_url, '_blank')}
          >
            <Ticket className="w-4 h-4 mr-2" />
            {t('Register Now')}
          </Button>
          {registration.registration_deadline && (
            <p className="text-xs text-white/80 mt-2">
              {t('Deadline')}: {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(registration.registration_deadline, false) : new Date(registration.registration_deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderContact = (contact: any) => {
    if (!contact.organizer_name) return null;
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border p-4" style={{ borderColor: colors.primary + '20' }}>
          <h3 className="font-semibold text-sm mb-3 flex items-center" style={{ color: colors.text }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2" style={{ backgroundColor: colors.primary + '15' }}>
              <User className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            {t('Event Organizer')}
          </h3>
          <div className="space-y-2">
            <div className="font-medium text-sm" style={{ color: colors.text }}>
              {contact.organizer_name}
            </div>
            <div className="space-y-1">
              {contact.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" style={{ color: colors.primary }} />
                  <a href={`mailto:${contact.email}`} className="text-xs hover:underline" style={{ color: colors.primary }}>
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3" style={{ color: colors.primary }} />
                  <a href={`tel:${contact.phone}`} className="text-xs hover:underline" style={{ color: colors.primary }}>
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-3 h-3" style={{ color: colors.primary }} />
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: colors.primary }}>
                    {t('Visit Website')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQrShare = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border-l-4 p-4" style={{ borderColor: colors.primary }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: colors.text }}>
                  {qrData.qr_title || t('Share Conference')}
                </h3>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block mr-1"></div>
                <span className="text-xs text-gray-500">{t('Digital Access')}</span>
              </div>
            </div>
          </div>
          
          {qrData.qr_description && (
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            size="sm" 
            className="w-full font-medium"
            style={{ backgroundColor: colors.primary, color: 'white' }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openQrModal'))}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('Share QR Code')}
          </Button>
        </div>
      </div>
    );
  };

  // Get ordered sections
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