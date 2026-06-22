import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/custom-toast';
import { Eye, EyeOff } from 'lucide-react';

import { useTranslation } from 'react-i18next';

interface DomainConfigProps {
  data: {
    slug: string;
    custom_domain?: string;
    url_prefix?: string;
    password?: string;
    password_enabled?: boolean;
    domain_type?: 'slug' | 'subdomain' | 'domain';
  };
  onUpdate: (field: string, value: any) => void;
  slugStatus?: { available: boolean; checking: boolean };
  onSlugChange?: (slug: string) => void;
  onPrefixChange?: (prefix: string) => void;
  businessId?: number;
  canUseCustomDomain?: boolean;
  canUseSubdomain?: boolean;
  canUsePasswordProtection?: boolean;
  type?: 'business' | 'biolink';
}

export default function DomainConfig({ data, onUpdate, slugStatus, onSlugChange, onPrefixChange, businessId, canUseCustomDomain = true, canUseSubdomain = true, canUsePasswordProtection = true, type = 'business' }: DomainConfigProps) {
  const { t } = useTranslation();
  const sanitizePathSegment = React.useCallback((value: string) => {
    return value.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-');
  }, []);

  const [domainType, setDomainType] = React.useState(() => {
    // Initialize with proper domain type from data
    const initialType = data.domain_type || 'slug';
    // Validate that the user has access to the selected type
    if ((initialType === 'domain' && !canUseCustomDomain) || 
        (initialType === 'subdomain' && !canUseSubdomain)) {
      return 'slug';
    }
    return initialType;
  });
  const [domainStatus, setDomainStatus] = React.useState({ available: true, checking: false });
  const [showPassword, setShowPassword] = React.useState(false);
  
  React.useEffect(() => {
    const newDomainType = data.domain_type || 'slug';
    // Reset to slug if user doesn't have access to selected domain type
    if ((newDomainType === 'domain' && !canUseCustomDomain) || 
        (newDomainType === 'subdomain' && !canUseSubdomain)) {
      setDomainType('slug');
      onUpdate('domain_type', 'slug');
    } else {
      setDomainType(newDomainType);
    }
  }, [data.domain_type, canUseCustomDomain, canUseSubdomain, onUpdate]);
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  const checkDomainAvailability = React.useCallback(
    debounce(async (domain) => {
      if (!domain || domain.length < 3) {
        setDomainStatus({ available: true, checking: false });
        return;
      }
      
      setDomainStatus({ available: true, checking: true });
      
      try {
        const apiRoute = type === 'biolink' ? 'api.bio-link.check-domain' : 'check-domain';
        const idField = type === 'biolink' ? 'bio_link_id' : 'business_id';
        
        const response = await fetch(route(apiRoute), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          },
          body: JSON.stringify({ domain, [idField]: businessId })
        });
        
        const result = await response.json();
        setDomainStatus({ available: result.available, checking: false });
      } catch (error) {
        setDomainStatus({ available: true, checking: false });
      }
    }, 500),
    [businessId]
  );
  
  React.useEffect(() => {
    if (domainType === 'domain' && data.custom_domain) {
      checkDomainAvailability(data.custom_domain);
    }
  }, [data.custom_domain, domainType, checkDomainAvailability]);
  
  const getPreviewUrl = () => {
    switch (domainType) {
      case 'domain':
        return data.custom_domain ? `https://${data.custom_domain}` : 'https://yourdomain.com';
      case 'subdomain':
        const hostname = window.location.hostname;
        // Extract base domain from current hostname
        const parts = hostname.split('.');
        const baseHost = parts.length > 1 ? parts.slice(-2).join('.') : hostname;
        return data.slug ? `https://${data.slug}.${baseHost}` : `https://your-slug.${baseHost}`;
      case 'slug':
      default:
        return data.url_prefix 
          ? `${window.appSettings.baseUrl}/${data.url_prefix}/${data.slug || 'your-slug'}`
          : `${window.appSettings.baseUrl}/${data.slug || 'your-slug'}`;
    }
  };

  return (
    <Card>
      <div className="p-3 border-b bg-muted/30">
        <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">2</span>{t("Domain & URL Settings")}</h3>
      </div>
      <div className="p-3 space-y-3">
        {/* Domain Type Selection */}
        <div>
          <Label className="text-sm mb-1 block">{t("URL Type")}</Label>
          <div className="flex space-x-3">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="slug" 
                name="domain_type" 
                value="slug" 
                checked={domainType === 'slug'}
                onChange={() => {
                  setDomainType('slug');
                  onUpdate('domain_type', 'slug');
                }}
                className="h-3 w-3 text-blue-600"
              />
              <Label htmlFor="slug" className="text-sm cursor-pointer ml-1">
                {t("Slug")}
              </Label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="radio" 
                id="subdomain" 
                name="domain_type" 
                value="subdomain" 
                checked={domainType === 'subdomain'}
                disabled={!canUseSubdomain}
                onChange={() => {
                  if (canUseSubdomain) {
                    setDomainType('subdomain');
                    onUpdate('domain_type', 'subdomain');
                  }
                }}
                className="h-3 w-3 text-blue-600 disabled:opacity-50"
              />
              <Label htmlFor="subdomain" className={`text-sm cursor-pointer ml-1 ${!canUseSubdomain ? 'opacity-50' : ''}`}>
                {t("Subdomain")}
                {!canUseSubdomain && <span className="text-xs text-amber-600 ml-1">({t('Plan upgrade required')})</span>}
              </Label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="radio" 
                id="domain" 
                name="domain_type" 
                value="domain" 
                checked={domainType === 'domain'}
                disabled={!canUseCustomDomain}
                onChange={() => {
                  if (canUseCustomDomain) {
                    setDomainType('domain');
                    onUpdate('domain_type', 'domain');
                  }
                }}
                className="h-3 w-3 text-blue-600 disabled:opacity-50"
              />
              <Label htmlFor="domain" className={`text-sm cursor-pointer ml-1 ${!canUseCustomDomain ? 'opacity-50' : ''}`}>
                {t("Domain")}
                {!canUseCustomDomain && <span className="text-xs text-amber-600 ml-1">({t('Plan upgrade required')})</span>}
              </Label>
            </div>
          </div>
        </div>

        {/* Configuration Fields */}
        <div className="space-y-3">
          {domainType === 'domain' && (
            <div>
              <Label className="text-sm mb-1 block">{t("Custom Domain")}</Label>
              <Input
                value={data.custom_domain || ''}
                onChange={(e) => {
                  onUpdate('custom_domain', e.target.value);
                  checkDomainAvailability(e.target.value);
                }}
                placeholder="yourdomain.com"
                className={`h-9 text-sm ${domainStatus && !domainStatus.available ? 'border-red-500' : ''}`}
              />
              {domainStatus && (
                <div className="mt-1 flex items-center">
                  {domainStatus.checking && (
                    <span className="text-xs text-gray-500">{t("Checking...")}</span>
                  )}
                  {!domainStatus.checking && !domainStatus.available && (
                    <span className="text-xs text-red-500">{t("Not available")}</span>
                  )}
                  {!domainStatus.checking && domainStatus.available && data.custom_domain && (
                    <span className="text-xs text-green-500">{t("Available")}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {domainType === 'slug' && (
            <div>
              <Label className="text-sm mb-1 block">{t("URL Prefix")}</Label>
              <Input
                value={data.url_prefix || ''}
                onChange={(e) => {
                  const sanitized = sanitizePathSegment(e.target.value);
                  onUpdate('url_prefix', sanitized);
                  if (onPrefixChange) onPrefixChange(sanitized);
                }}
                placeholder={t('Enter URL prefix')}
                className="h-9 text-sm"
              />
            </div>
          )}

          {(domainType === 'slug' || domainType === 'subdomain') && (
            <div>
              <Label className="text-sm mb-1 block" required>
                {domainType === 'slug' ? t("URL Path") : t("Slug")}
              </Label>
              <Input
                value={data.slug || ''}
                onChange={(e) => {
                  const sanitized = sanitizePathSegment(e.target.value);
                  onSlugChange ? onSlugChange(sanitized) : onUpdate('slug', sanitized);
                }}
                placeholder={domainType === 'slug' ? t("your-url-path") : t("your-slug")}
                className={`h-9 text-sm ${slugStatus && !slugStatus.available ? 'border-red-500' : ''}`}
              />
              {slugStatus && (
                <div className="mt-1 flex items-center">
                  {slugStatus.checking && (
                    <span className="text-xs text-gray-500">{t("Checking...")}</span>
                  )}
                  {!slugStatus.checking && !slugStatus.available && (
                    <span className="text-xs text-red-500">
                      {domainType === 'slug' ? t("URL path not available") : t("Slug not available")}
                    </span>
                  )}
                  {!slugStatus.checking && slugStatus.available && data.slug && (
                    <span className="text-xs text-green-500">
                      {domainType === 'slug' ? t("URL path available") : t("Slug available")}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Protection */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Label className="text-sm">{t("Password Protection")}</Label>
              {!canUsePasswordProtection && (
                <p className="text-xs text-amber-600">{t('Password protection requires plan upgrade')}</p>
              )}
            </div>
            <Switch
              checked={data.password_enabled || false}
              onCheckedChange={(checked) => onUpdate('password_enabled', checked)}
              disabled={!canUsePasswordProtection}
              className="scale-75"
            />
          </div>
          
          {data.password_enabled && (
            <div>
              <Label className="text-sm mb-1 block">{t("Password")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password || ''}
                  onChange={(e) => onUpdate('password', e.target.value)}
                  placeholder={t("Enter password")}
                  className="h-9 pr-10 text-sm"
                  minLength={4}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview URL */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-sm">{t("Public URL")}</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(getPreviewUrl());
                  toast.success(t('Link copied to clipboard'));
                } catch (error) {
                  toast.error(t('Failed to copy link'));
                }
              }}
            >
              {t("Copy")}
            </Button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded border text-sm">
            <p className="font-mono text-blue-600 dark:text-blue-400 break-all">
              {getPreviewUrl()}
              {data.password_enabled && <span className="text-orange-500 ml-1">🔒</span>}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
