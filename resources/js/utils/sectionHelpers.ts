export interface SectionConfig {
  key: string;
  enabled: boolean;
  order: number;
}

export const getSectionOrder = (templateConfig: any, allSections: any[] = [], allowedSections?: string[]): string[] => {
  const sectionSettings = templateConfig?.sectionSettings || {};
  const configSections = templateConfig?.sections || {};
  
  const sectionsWithOrder = allSections.map((section, index) => {
    const settings = sectionSettings[section.key] || {};
    const sectionData = configSections[section.key] || {};
    
    return {
      key: section.key,
      enabled: settings.enabled ?? sectionData.enabled ?? true,
      order: settings.order ?? sectionData.order ?? index
    };
  });

  return sectionsWithOrder
    .filter(section => {
      // First check if section is enabled
      if (!section.enabled) return false;
      
      // If allowedSections is provided, only include sections that are in the allowed list
      if (allowedSections && allowedSections.length > 0) {
        return allowedSections.includes(section.key);
      }
      
      return true;
    })
    .sort((a, b) => a.order - b.order)
    .map(section => section.key);
};

export const isSectionEnabled = (templateConfig: any, sectionKey: string): boolean => {
  // Check both sectionSettings and section_visibility
  const sectionSettingsEnabled = templateConfig?.sectionSettings?.[sectionKey]?.enabled;
  const sectionVisibilityEnabled = templateConfig?.section_visibility?.[sectionKey];
  
  // If either is explicitly false, section is disabled
  if (sectionSettingsEnabled === false || sectionVisibilityEnabled === false) {
    return false;
  }
  
  return true; // Default to enabled
};

export const getSectionData = (templateConfig: any, sectionKey: string): any => {
  return templateConfig?.sections?.[sectionKey] || templateConfig?.[sectionKey] || {};
};

export const updateSectionVisibility = (templateConfig: any, sectionKey: string, enabled: boolean): any => {
  const updatedConfig = { ...templateConfig };
  
  if (!updatedConfig.section_visibility) {
    updatedConfig.section_visibility = {};
  }
  
  updatedConfig.section_visibility[sectionKey] = enabled;
  
  return updatedConfig;
};

export const isTemplatesSectionEnabled = (configSections: any): boolean => {
  if (!configSections) {
    return true; // Default to enabled
  }

  // Check section_visibility for templates
  if (configSections.section_visibility && configSections.section_visibility.hasOwnProperty('templates')) {
    return configSections.section_visibility.templates !== false;
  }

  return true; // Default to enabled
};

// Helper function for templates to get filtered section order
export const getFilteredSectionOrder = (data: any, allSections: any[]): string[] => {
  const templateConfig = data.template_config || { sections: data.config_sections, sectionSettings: data.config_sections };
  const allowedSections = templateConfig.allowedSections;
  
  return getSectionOrder(templateConfig, allSections, allowedSections)
    .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright');
};