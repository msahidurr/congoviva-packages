import React from 'react';
import ConferenceTemplate from './templates/ConferenceTemplate';
import WeddingTemplate from './templates/WeddingTemplate';
import BirthdayTemplate from './templates/BirthdayTemplate';
import ArtExhibitionTemplate from './templates/ArtExhibitionTemplate';
import MusicFestivalTemplate from './templates/MusicFestivalTemplate';
import { eventTypeOptions, getEventTemplate } from '../event-templates';

interface EventPreviewProps {
  data: any;
}

// Map of event types to their template components
const templateComponents: Record<string, React.ComponentType<any>> = {
  'conference': ConferenceTemplate,
  'wedding': WeddingTemplate,
  'birthday': BirthdayTemplate,
  'art-exhibition': ArtExhibitionTemplate,
  'music-festival': MusicFestivalTemplate
};

export default function EventPreview({ data }: EventPreviewProps) {
  // Check if the event type exists in our options
  const isValidType = eventTypeOptions.some(option => option.value === data.event_type);
  const type = isValidType ? data.event_type : 'conference'; // Default to conference if invalid
  
  // Get the template
  const template = getEventTemplate(type);
  
  // Ensure template_config has sectionSettings
  const enhancedData = {
    ...data,
    template_config: {
      ...data.template_config,
      sections: data.config_sections,
      sectionSettings: data.config_sections || {}
    }
  };
  
  // Get the template component
  const TemplateComponent = templateComponents[type] || ConferenceTemplate;

  return (
    <div className="w-full">
      <TemplateComponent data={enhancedData} template={template} />
    </div>
  );
}