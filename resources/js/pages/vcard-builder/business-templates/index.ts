import { freelancerTemplate } from './freelancer';
import { doctorTemplate } from './doctor';
import { restaurantTemplate } from './restaurant';
import { realEstateTemplate } from './realestate';
import { fitnessTemplate } from './fitness';
import { photographyTemplate } from './photography';
import { lawfirmTemplate } from './lawfirm';
import { cafeTemplate } from './cafe';
import { salonTemplate } from './salon';
import { constructionTemplate } from './construction';
import { eventplannerTemplate } from './eventplanner';
import { ecommerceTemplate } from './ecommerce';
import { travelTemplate } from './travel';
import { gymTemplate } from './gym';
import { bakeryTemplate } from './bakery';
import { fitnessStudioTemplate } from './fitness-studio';
import { techStartupTemplate } from './tech-startup';
import { musicArtistTemplate } from './music-artist';
import { weddingPlannerTemplate } from './wedding-planner';
import { petCareTemplate } from './pet-care';
import { digitalMarketingTemplate } from './digital-marketing';
import { automotiveTemplate } from './automotive';
import { beautyCosmeticsTemplate } from './beauty-cosmetics';
import { foodDeliveryTemplate } from './food-delivery';
import { homeServicesTemplate } from './home-services';
import { personalTrainerTemplate } from './personal-trainer';
import { consultingTemplate } from './consulting';
import { graphicDesignTemplate } from './graphic-design';
import { yogaWellnessTemplate } from './yoga-wellness';
import { podcastCreatorTemplate } from './podcast-creator';
import { gamingStreamerTemplate } from './gaming-streamer';
import { lifeCoachTemplate } from './life-coach';
import { veterinarianTemplate } from './veterinarian';
import { architectDesignerTemplate } from './architect-designer';
import { hotelResortsTemplate } from './hotel-resorts';
import { insuranceTemplate } from './insurance';
import { neutralProfessionalTemplate } from './neutral-professional';
import { influencerTemplate } from './influencer';
import { actorTemplate } from './actor';
import { carMechanicTemplate } from './car-mechanic';
import { sportsAcademyTemplate } from './sports-academy';

export const businessTemplates = {
  'freelancer': freelancerTemplate,
  'doctor': doctorTemplate,
  'restaurant': restaurantTemplate,
  'realestate': realEstateTemplate,
  'fitness': fitnessTemplate,
  'photography': photographyTemplate,
  'lawfirm': lawfirmTemplate,
  'cafe': cafeTemplate,
  'salon': salonTemplate,
  'construction': constructionTemplate,
  'eventplanner': eventplannerTemplate,
  'ecommerce': ecommerceTemplate,
  'travel': travelTemplate,
  'gym': gymTemplate,
  'bakery': bakeryTemplate,
  'fitness-studio': fitnessStudioTemplate,
  'tech-startup': techStartupTemplate,
  'music-artist': musicArtistTemplate,
  'wedding-planner': weddingPlannerTemplate,
  'pet-care': petCareTemplate,
  'digital-marketing': digitalMarketingTemplate,
  'automotive': automotiveTemplate,
  'beauty-cosmetics': beautyCosmeticsTemplate,
  'food-delivery': foodDeliveryTemplate,
  'home-services': homeServicesTemplate,
  'personal-trainer': personalTrainerTemplate,
  'consulting': consultingTemplate,
  'graphic-design': graphicDesignTemplate,
  'yoga-wellness': yogaWellnessTemplate,
  'podcast-creator': podcastCreatorTemplate,
  'gaming-streamer': gamingStreamerTemplate,
  'life-coach': lifeCoachTemplate,
  'veterinarian': veterinarianTemplate,
  'architect-designer': architectDesignerTemplate,
  'hotel-resorts': hotelResortsTemplate,
  'insurance': insuranceTemplate,
  'neutral-professional': neutralProfessionalTemplate,
  'influencer': influencerTemplate,
  'actor': actorTemplate,
  'car-mechanic': carMechanicTemplate,
  'sports-academy': sportsAcademyTemplate
};

export const businessTypeOptions = [
  { value: 'freelancer', label: 'Freelancer', themeNumber: 1, icon: '💼' },
  { value: 'doctor', label: 'Doctor/Medical', themeNumber: 2, icon: '👨⚕️' },
  { value: 'restaurant', label: 'Restaurant', themeNumber: 3, icon: '🍽️' },
  { value: 'realestate', label: 'Real Estate Agent', themeNumber: 4, icon: '🏠' },
  { value: 'fitness', label: 'Fitness Trainer', themeNumber: 5, icon: '💪' },
  { value: 'photography', label: 'Photography', themeNumber: 6, icon: '📸' },
  { value: 'lawfirm', label: 'Law Firm', themeNumber: 7, icon: '⚖️' },
  { value: 'cafe', label: 'Cafe & Coffee Shop', themeNumber: 8, icon: '☕' },
  { value: 'salon', label: 'Salon & Spa', themeNumber: 9, icon: '💇♀️' },
  { value: 'construction', label: 'Construction & Contractor', themeNumber: 10, icon: '🏗️' },
  { value: 'eventplanner', label: 'Event Planner', themeNumber: 11, icon: '🎉' },
  { value: 'ecommerce', label: 'E-commerce Store', themeNumber: 12, icon: '🛍️' },
  { value: 'travel', label: 'Travel Agency', themeNumber: 13, icon: '✈️' },
  { value: 'gym', label: 'Fitness Studio/Gym', themeNumber: 14, icon: '🏋️♀️' },
  { value: 'bakery', label: 'Bakery & Pastry Shop', themeNumber: 15, icon: '🍰' },
  { value: 'fitness-studio', label: 'Modern Fitness Studio', themeNumber: 16, icon: '🤸♀️' },
  { value: 'tech-startup', label: 'Tech Startup/SaaS', themeNumber: 17, icon: '💻' },
  { value: 'music-artist', label: 'Music Artist/Band', themeNumber: 18, icon: '🎵' },
  { value: 'wedding-planner', label: 'Wedding Planner', themeNumber: 19, icon: '💒' },
  { value: 'pet-care', label: 'Pet Care Services', themeNumber: 20, icon: '🐶' },
  { value: 'digital-marketing', label: 'Digital Marketing Agency', themeNumber: 21, icon: '📈' },
  { value: 'automotive', label: 'Automotive Services', themeNumber: 22, icon: '🚗' },
  { value: 'beauty-cosmetics', label: 'Beauty & Cosmetics', themeNumber: 23, icon: '💄' },
  { value: 'food-delivery', label: 'Food Delivery & Catering', themeNumber: 24, icon: '🍕' },
  { value: 'home-services', label: 'Home Services & Maintenance', themeNumber: 25, icon: '🔧' },
  { value: 'personal-trainer', label: 'Personal Trainer & Fitness Coach', themeNumber: 26, icon: '🏋️' },
  { value: 'consulting', label: 'Consulting & Professional Services', themeNumber: 27, icon: '📉' },
  { value: 'graphic-design', label: 'Graphic Design Studio', themeNumber: 28, icon: '🎨' },
  { value: 'yoga-wellness', label: 'Yoga & Wellness Studio', themeNumber: 29, icon: '🧘♀️' },
  { value: 'podcast-creator', label: 'Podcast Host & Content Creator', themeNumber: 30, icon: '🎧' },
  { value: 'gaming-streamer', label: 'Gaming Streamer & Esports', themeNumber: 31, icon: '🎮' },
  { value: 'life-coach', label: 'Life Coach & Motivational Speaker', themeNumber: 32, icon: '🌟' },
  { value: 'veterinarian', label: 'Veterinarian & Animal Care', themeNumber: 33, icon: '🐈' },
  { value: 'architect-designer', label: 'Architect & Interior Designer', themeNumber: 34, icon: '🏢' },
  { value: 'hotel-resorts', label: 'Hotel & Resorts', themeNumber: 35, icon: '🏨' },
  { value: 'insurance', label: 'Insurance Agent & Services', themeNumber: 35, icon: '🛡️' },
  { value: 'neutral-professional', label: 'Neutral Professional', themeNumber: 36, icon: '💼' },
  { value: 'influencer', label: 'Social Media Influencer', themeNumber: 38, icon: '✨' },
  { value: 'actor', label: 'Actor & Entertainment', themeNumber: 37, icon: '🎭' },
  { value: 'car-mechanic', label: 'Car Mechanic', themeNumber: 40, icon: '🚗' },
  { value: 'sports-academy', label: 'Sports Academy', themeNumber: 41, icon: '🏆' },
];

export const getBusinessTemplate = (type: string) => {
  return businessTemplates[type as keyof typeof businessTemplates] || null;
};

export const getDefaultSections = (type: string) => {
  const template = getBusinessTemplate(type);
  return template?.defaultData || {};
};