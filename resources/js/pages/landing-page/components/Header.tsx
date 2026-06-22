import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface CustomPage {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  is_active?: boolean;
  active?: boolean;
}

interface HeaderProps {
  brandColor?: string;
  textColor?: string;
  settings: {
    company_name: string;
    business_directory_enabled?: string | number | boolean;
    config_sections?: {
      theme?: {
        logo_light?: string;
        logo_dark?: string;
      };
      sections?: Array<{
        key: string;
        active?: boolean;
        [key: string]: any;
      }>;
      custom_pages?: Array<{
        key: string;
        name: string;
        slug: string;
        active?: boolean;
        [key: string]: any;
      }>;
    };
    registrationEnabled?: boolean;
  };
  sectionData?: any;
  customPages?: CustomPage[];
  user?: any;
}

export default function Header({ settings, sectionData, customPages = [], brandColor = '#3b82f6', textColor, user }: HeaderProps) {
  const { t } = useTranslation();
  
  // Get text color from sectionData or use textColor prop or default
  const getTextColor = () => {
    return sectionData?.text_color || textColor || '#374151'; // default gray-700
  };
  
  const currentTextColor = getTextColor();
  
  // Get button style from header section data
  const getButtonStyle = () => {
    const headerSection = sectionData || {};
    return headerSection.button_style || 'solid'; // default to gradient
  };
  
  const buttonStyle = getButtonStyle();
  
  const directoryEnabled = !settings?.business_directory_enabled || settings?.business_directory_enabled === '1' || settings?.business_directory_enabled === 1 || settings?.business_directory_enabled === true;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             document.documentElement.getAttribute('data-theme') === 'dark' ||
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    document.documentElement.getAttribute('data-theme') === 'dark' ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', checkTheme);
      observer.disconnect();
    };
  }, []);
  
  // Get active pages from settings
  const getActivePages = () => {
    const sections = settings?.config_sections?.sections || [];
    const settingsCustomPages = settings?.config_sections?.custom_pages || [];
    const activePages = [];
    
    // Check default pages
    const defaultPages = [
      { key: 'about-page', title: t('About Us'), route: 'custom-page.show', slug: 'about-us' },
      { key: 'privacy', title: t('Privacy Policy'), route: 'custom-page.show', slug: 'privacy-policy' },
      { key: 'terms', title: t('Terms of Service'), route: 'custom-page.show', slug: 'terms-of-service' },
      { key: 'contact-page', title: t('Contact Us'), route: 'custom-page.show', slug: 'contact-us' },
      { key: 'faq-page', title: t('FAQ'), route: 'custom-page.show', slug: 'faq' },
      { key: 'refund', title: t('Refund Policy'), route: 'custom-page.show', slug: 'refund-policy' },
    ];
    
    defaultPages.forEach(page => {
      const pageSection = sections.find(s => s.key === page.key);
      const isActive = pageSection ? (pageSection.active !== false) : true;
      if (isActive) {
        activePages.push({
          name: page.title,
          href: route(page.route, page.slug)
        });
      }
    });
    
    // Add custom pages from settings
    settingsCustomPages.forEach(page => {
      const pageSection = sections.find(s => s.key === page.key);
      const isActive = pageSection ? (pageSection.active !== false) : true;
      if (isActive) {
        const slug = page.slug || page.key;
        activePages.push({
          name: page.name,
          href: route('custom-page.show', slug)
        });
      }
    });
    
    // Add database custom pages (only non-default ones)
    if (customPages && Array.isArray(customPages)) {
      const defaultSlugs = ['about-us', 'privacy-policy', 'terms-of-service', 'refund-policy', 'faq', 'contact-us'];
      customPages.filter(page => page.is_active !== false && !defaultSlugs.includes(page.slug)).forEach(page => {
        activePages.push({
          name: page.title,
          href: route('custom-page.show', page.slug)
        });
      });
    }
    
    return activePages;
  };
  
  const menuItems = getActivePages();

  const isTransparent = sectionData?.transparent;
  const backgroundColor = sectionData?.background_color || '#ffffff';
  
  const getHeaderClasses = () => {
    if (isTransparent) {
      return isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
        : 'bg-transparent';
    }
    return isScrolled 
      ? 'shadow-lg border-b border-gray-200/50'
      : '';
  };

  const getHeaderStyle = () => {
    if (isTransparent) return {};
    return { backgroundColor };
  };
  

  
  // Get the appropriate logo based on context and theme
  const getLogo = () => {
    // Always use main settings for logos since directory doesn't have separate logos
    const logoLight = settings?.config_sections?.theme?.logo_light;
    const logoDark = settings?.config_sections?.theme?.logo_dark;
    
    // Dark mode: show dark logo, Light mode: show light logo
    return isDarkMode ? logoDark : logoLight;
  };
  
  const logoUrl = getLogo();
  const companyName = settings.company_name;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClasses()}`}
      style={getHeaderStyle()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href={route("home")} 
              className="flex items-center transition-colors"
              onMouseEnter={(e) => {
                const textElement = e.currentTarget.querySelector('.company-text') as HTMLElement;
                if (textElement) textElement.style.color = brandColor;
              }}
              onMouseLeave={(e) => {
                const textElement = e.currentTarget.querySelector('.company-text') as HTMLElement;
                if (textElement) textElement.style.color = '';
              }}
            >
              {logoUrl ? (
                <img 
                  key={`${logoUrl}-${isDarkMode}`}
                  src={getImageDisplayUrl(logoUrl)} 
                  alt={companyName}
                  className="h-8 w-auto max-w-[200px] object-contain"
                  onError={(e) => {
                    // Fallback to company name if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
              ) : null}
              <span 
                className={`company-text text-2xl font-bold transition-colors ${
                  logoUrl ? 'hidden' : 'block'
                }`}
                style={{ color: currentTextColor }}
              >
                {companyName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {directoryEnabled && (
              <Link
                href={route('directory.index')}
                className="text-sm font-medium transition-colors relative group"
                style={{ color: currentTextColor, '--hover-color': brandColor } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
                onMouseLeave={(e) => e.currentTarget.style.color = currentTextColor}
              >
                {t("Business Directory")}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" 
                  style={{ backgroundColor: brandColor }}
                  aria-hidden="true"
                ></span>
              </Link>
            )}
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors relative group"
                style={{ color: currentTextColor, '--hover-color': brandColor } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
                onMouseLeave={(e) => e.currentTarget.style.color = currentTextColor}
              >
                {item.name}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" 
                  style={{ backgroundColor: brandColor }}
                  aria-hidden="true"
                ></span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                href={route('dashboard')}
                prefetch
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
                  buttonStyle === 'outline' ? 'bg-transparent' : ''
                }`}
                style={(() => {
                  switch (buttonStyle) {
                    case 'solid':
                      return {
                        backgroundColor: brandColor,
                        color: 'white',
                        borderColor: brandColor
                      };
                    case 'outline':
                      return {
                        backgroundColor: 'transparent',
                        color: brandColor,
                        borderColor: brandColor
                      };
                    case 'gradient':
                    default:
                      return {
                        backgroundImage: `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`,
                        color: 'white',
                        borderColor: 'transparent'
                      };
                  }
                })()}
                onMouseEnter={(e) => {
                  switch (buttonStyle) {
                    case 'solid':
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = brandColor;
                      break;
                    case 'outline':
                      e.currentTarget.style.backgroundColor = brandColor;
                      e.currentTarget.style.color = 'white';
                      break;
                    case 'gradient':
                    default:
                      e.currentTarget.style.backgroundImage = 'none';
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = brandColor;
                      break;
                  }
                }}
                onMouseLeave={(e) => {
                  switch (buttonStyle) {
                    case 'solid':
                      e.currentTarget.style.backgroundColor = brandColor;
                      e.currentTarget.style.color = 'white';
                      break;
                    case 'outline':
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = brandColor;
                      break;
                    case 'gradient':
                    default:
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.backgroundImage = `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`;
                      e.currentTarget.style.color = 'white';
                      break;
                  }
                }}
              >
                {t("Dashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  prefetch
                  className="text-sm font-medium transition-colors"
                  style={{ color: currentTextColor }}
                  onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = currentTextColor}
                >
                  {t("Login")}
                </Link>
                {settings?.registrationEnabled != false && (
                  <Link
                    href={route('register')}
                    prefetch
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border-0 focus:outline-none focus:ring-0 ${
                      buttonStyle === 'outline' ? 'bg-transparent' : ''
                    }`}
                    style={(() => {
                      switch (buttonStyle) {
                        case 'solid':
                          return {
                            backgroundColor: brandColor,
                            color: 'white',
                            borderColor: brandColor
                          };
                        case 'outline':
                          return {
                            backgroundColor: 'transparent',
                            color: brandColor,
                            borderColor: brandColor
                          };
                        case 'gradient':
                        default:
                          return {
                            backgroundImage: `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`,
                            color: 'white',
                            borderColor: 'transparent'
                          };
                      }
                    })()}
                    onMouseEnter={(e) => {
                      switch (buttonStyle) {
                        case 'solid':
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = brandColor;
                          break;
                        case 'outline':
                          e.currentTarget.style.backgroundColor = brandColor;
                          e.currentTarget.style.color = 'white';
                          break;
                        case 'gradient':
                        default:
                          e.currentTarget.style.backgroundImage = 'none';
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = brandColor;
                          break;
                      }
                    }}
                    onMouseLeave={(e) => {
                      switch (buttonStyle) {
                        case 'solid':
                          e.currentTarget.style.backgroundColor = brandColor;
                          e.currentTarget.style.color = 'white';
                          break;
                        case 'outline':
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = brandColor;
                          break;
                        case 'gradient':
                        default:
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.backgroundImage = `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`;
                          e.currentTarget.style.color = 'white';
                          break;
                      }
                    }}
                  >
                    {t("Get Started")}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200" id="mobile-menu">
            <div 
              className="px-4 py-6 space-y-4"
              style={isTransparent ? { backgroundColor: 'white' } : { backgroundColor }}
            >              
              {directoryEnabled && (
                <Link
                  href={route('directory.index')}
                  prefetch
                  className="block text-base font-medium transition-colors"
                  style={{ color: currentTextColor }}
                  onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = currentTextColor}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("Business Directory")}
                </Link>
              )}
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch
                  className="block text-base font-medium transition-colors"
                  style={{ color: currentTextColor }}
                  onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = currentTextColor}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                {user ? (
                  <Link
                    href={route('dashboard')}
                    prefetch
                    className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
                      buttonStyle === 'outline' ? 'bg-transparent' : ''
                    }`}
                    style={(() => {
                      switch (buttonStyle) {
                        case 'solid':
                          return {
                            backgroundColor: brandColor,
                            color: 'white',
                            borderColor: brandColor
                          };
                        case 'outline':
                          return {
                            backgroundColor: 'transparent',
                            color: brandColor,
                            borderColor: brandColor
                          };
                        case 'gradient':
                        default:
                          return {
                            backgroundImage: `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`,
                            color: 'white',
                            borderColor: 'transparent'
                          };
                      }
                    })()}
                    onMouseEnter={(e) => {
                      switch (buttonStyle) {
                        case 'solid':
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = brandColor;
                          break;
                        case 'outline':
                          e.currentTarget.style.backgroundColor = brandColor;
                          e.currentTarget.style.color = 'white';
                          break;
                        case 'gradient':
                        default:
                          e.currentTarget.style.backgroundImage = 'none';
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = brandColor;
                          break;
                      }
                    }}
                    onMouseLeave={(e) => {
                      switch (buttonStyle) {
                        case 'solid':
                          e.currentTarget.style.backgroundColor = brandColor;
                          e.currentTarget.style.color = 'white';
                          break;
                        case 'outline':
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = brandColor;
                          break;
                        case 'gradient':
                        default:
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.backgroundImage = `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`;
                          e.currentTarget.style.color = 'white';
                          break;
                      }
                    }}
                  >
                    {t("Dashboard")}
                  </Link>
                ) : (
                  <>
                    <Link
                      href={route('login')}
                      prefetch
                      className="block w-full text-center text-sm font-medium transition-colors py-2.5"
                      style={{ color: currentTextColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = currentTextColor}
                    >
                      {t("Login")}
                    </Link>
                    {settings?.registrationEnabled != false && (
                    <Link
                      href={route('register')}
                      prefetch
                      className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
                        buttonStyle === 'outline' ? 'bg-transparent' : ''
                      }`}
                      style={(() => {
                        switch (buttonStyle) {
                          case 'solid':
                            return {
                              backgroundColor: brandColor,
                              color: 'white',
                              borderColor: brandColor
                            };
                          case 'outline':
                            return {
                              backgroundColor: 'transparent',
                              color: brandColor,
                              borderColor: brandColor
                            };
                          case 'gradient':
                          default:
                            return {
                              backgroundImage: `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`,
                              color: 'white',
                              borderColor: 'transparent'
                            };
                        }
                      })()}
                      onMouseEnter={(e) => {
                        switch (buttonStyle) {
                          case 'solid':
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = brandColor;
                            break;
                          case 'outline':
                            e.currentTarget.style.backgroundColor = brandColor;
                            e.currentTarget.style.color = 'white';
                            break;
                          case 'gradient':
                          default:
                            e.currentTarget.style.backgroundImage = 'none';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = brandColor;
                            break;
                        }
                      }}
                      onMouseLeave={(e) => {
                        switch (buttonStyle) {
                          case 'solid':
                            e.currentTarget.style.backgroundColor = brandColor;
                            e.currentTarget.style.color = 'white';
                            break;
                          case 'outline':
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = brandColor;
                            break;
                          case 'gradient':
                          default:
                            e.currentTarget.style.backgroundColor = '';
                            e.currentTarget.style.backgroundImage = `linear-gradient(135deg, ${brandColor}, ${brandColor}66)`;
                            e.currentTarget.style.color = 'white';
                            break;
                        }
                      }}
                    >
                      {t("Get Started")}
                    </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}