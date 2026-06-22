/**
 * Helper function to ensure all required sections are displayed in templates
 */
export function ensureRequiredSections(configSections: any, defaultSections: any = {}) {
  // Check if there are allowed sections restrictions
  const allowedSections = configSections._allowed_sections;
  
  if (allowedSections && Array.isArray(allowedSections)) {
    // If there are restrictions, only include allowed sections + essentials
    const essentialSections = ['colors', 'font', 'language', 'pwa', 'seo', 'pixels', '_allowed_sections'];
    const enhancedSections: any = {};
    
    Object.keys(configSections).forEach(key => {
      if (allowedSections.includes(key) || essentialSections.includes(key)) {
        enhancedSections[key] = configSections[key] ?? defaultSections[key] ?? {};
      }
    });
    
    return enhancedSections;
  }
  
  // No restrictions - preserve existing values and only backfill missing sections
  const enhancedSections = { ...configSections };
  
  Object.keys(defaultSections).forEach(key => {
    if (enhancedSections[key] === undefined || enhancedSections[key] === null) {
      enhancedSections[key] = defaultSections[key];
    }
  });
  
  return enhancedSections;
}
