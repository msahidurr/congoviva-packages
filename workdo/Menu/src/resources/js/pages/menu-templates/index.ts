import { cafeTemplate } from './cafe';
import { restaurantTemplate } from './restaurant';
import { fastfoodTemplate } from './fastfood';
import { pizzaTemplate } from './pizza';
import { barTemplate } from './bar';

export const menuTemplates = {
  cafe: cafeTemplate,
  restaurant: restaurantTemplate,
  fastfood: fastfoodTemplate,
  pizza: pizzaTemplate,
  bar: barTemplate
};

export function getMenuTemplate(templateId: string) {
  return menuTemplates[templateId as keyof typeof menuTemplates];
}

export function getAllMenuTemplates() {
  return Object.values(menuTemplates);
}