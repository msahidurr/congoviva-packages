/**
 * Test utility to verify template section enable/disable functionality
 */

import { isSectionEnabled, updateSectionVisibility, isTemplatesSectionEnabled } from './sectionHelpers';

export const testTemplateSectionFunctionality = () => {
  
  // Test 1: Default behavior (should be enabled)
  const emptyConfig = {};
  
  // Test 2: Explicitly enabled
  const enabledConfig = {
    section_visibility: {
      templates: true
    }
  };
  
  // Test 3: Explicitly disabled
  const disabledConfig = {
    section_visibility: {
      templates: false
    }
  };
  
  // Test 4: Update section visibility
  let testConfig = { section_visibility: {} };
  testConfig = updateSectionVisibility(testConfig, 'templates', false);
  
  testConfig = updateSectionVisibility(testConfig, 'templates', true);
  
  // Test 5: isSectionEnabled function
  const templateConfig = {
    section_visibility: {
      templates: true
    }
  };
  
  const disabledTemplateConfig = {
    section_visibility: {
      templates: false
    }
  };
  
};

// Export for use in development/debugging
if (typeof window !== 'undefined') {
  (window as any).testTemplateSectionFunctionality = testTemplateSectionFunctionality;
}