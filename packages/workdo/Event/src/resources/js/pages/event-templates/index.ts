import { conferenceTemplate } from './conference';
import { weddingTemplate } from './wedding';
import { birthdayTemplate } from './birthday';
import { artExhibitionTemplate } from './art-exhibition';
import { musicFestivalTemplate } from './music-festival';

export const eventTemplates = {
  'conference': conferenceTemplate,
  'wedding': weddingTemplate,
  'birthday': birthdayTemplate,
  'art-exhibition': artExhibitionTemplate,
  'music-festival': musicFestivalTemplate
};

export const eventTypeOptions = [
  { value: 'conference', label: 'Conference & Summit' },
  { value: 'wedding', label: 'Wedding Celebration' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'art-exhibition', label: 'Art Exhibition' },
  { value: 'music-festival', label: 'Music Festival' }
];

export const getEventTemplate = (type: string) => {
  return eventTemplates[type as keyof typeof eventTemplates] || null;
};

export const getDefaultSections = (type: string) => {
  const template = getEventTemplate(type);
  return template?.sections || [];
};