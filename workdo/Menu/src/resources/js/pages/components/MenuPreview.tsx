import React from 'react';
import CafeMenuTemplate from './templates/CafeMenuTemplate';
import RestaurantMenuTemplate from './templates/RestaurantMenuTemplate';
import FastFoodMenuTemplate from './templates/FastFoodMenuTemplate';
import PizzaMenuTemplate from './templates/PizzaMenuTemplate';
import BarMenuTemplate from './templates/BarMenuTemplate';
import { getMenuTemplate } from '../menu-templates';

interface MenuPreviewProps {
  data: any;
  menuType: string;
}

export default function MenuPreview({ data, menuType }: MenuPreviewProps) {
  const template = getMenuTemplate(menuType);
  
  // Ensure template_config has sectionSettings
  const enhancedData = {
    ...data,
    template_config: {
      ...data.template_config,
      sections: data.config_sections,
      sectionSettings: data.config_sections || {}
    }
  };
  
  const renderTemplate = () => {
    switch (menuType) {
      case 'cafe':
        return <CafeMenuTemplate data={enhancedData} template={template} />;
      case 'restaurant':
        return <RestaurantMenuTemplate data={enhancedData} template={template} />;
      case 'fastfood':
        return <FastFoodMenuTemplate data={enhancedData} template={template} />;
      case 'pizza':
        return <PizzaMenuTemplate data={enhancedData} template={template} />;
      case 'bar':
        return <BarMenuTemplate data={enhancedData} template={template} />;
      default:
        return <CafeMenuTemplate data={enhancedData} template={template} />;
    }
  };

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
}