import React from 'react';
import { useTranslation } from 'react-i18next';
import { getAllMenuTemplates } from './menu-templates';

export default function Templates() {
  const { t } = useTranslation();
  const templates = getAllMenuTemplates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Menu Templates')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('Choose from our collection of professional menu templates')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>
              
              <div className="flex items-center space-x-2 mb-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: template.defaultColors.primary }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: template.defaultColors.secondary }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: template.defaultColors.accent }}
                ></div>
              </div>
              
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                {t('Use Template')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}