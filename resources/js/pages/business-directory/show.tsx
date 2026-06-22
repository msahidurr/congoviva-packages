import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, Eye, Phone, Mail, Globe, MapPin, Clock, Calendar, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useFavicon } from '@/hooks/use-favicon';

interface Business {
  id: number;
  name: string;
  business_type: string;
  slug: string;
  url_prefix: string;
  is_featured: boolean;
  is_verified: boolean;
  rating: number;
  rating_count: number;
  view_count: number;
  directory_description?: string;
  config_sections: any;
  created_at: string;
}

interface Props {
  business: Business;
}

export default function BusinessDirectoryShow({ business }: Props) {
  const { t } = useTranslation();

  // Apply favicon from brand settings
  useFavicon();

  const getBusinessUrl = () => {
    if (business.url_prefix && business.url_prefix !== '') {
      return route('public.vcard.show', { prefix: business.url_prefix, slug: business.slug });
    }
    return route('public.vcard.show.direct', { slug: business.slug });
  };

  const getContactInfo = () => {
    const contact = business.config_sections?.contact || {};
    return {
      phone: contact.phone,
      email: contact.email,
      website: contact.website,
      address: contact.address || contact.clinic_address,
    };
  };

  const getBusinessHours = () => {
    return business.config_sections?.business_hours?.hours || [];
  };

  const getServices = () => {
    const services = business.config_sections?.services?.service_list ||
      business.config_sections?.specialties?.specialty_list ||
      business.config_sections?.menu_highlights?.menu_items || [];
    return services.slice(0, 6); // Show max 6 services
  };

  const getAboutInfo = () => {
    return business.config_sections?.about || {};
  };

  const getAboutExtras = (about: any) => {
    const { description, ...rest } = about;
    const excluded = ['order', 'enabled'];
    return Object.entries(rest).filter(([k, v]) => !excluded.includes(k) && v !== '' && v !== null && v !== undefined);
  };

  const contact = getContactInfo();
  const hours = getBusinessHours();
  const services = getServices();
  const about = getAboutInfo();

  return (
    <>
      <Head title={`${business.name} - Business Directory`} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
            {/* Back */}
            <div className="mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={route('directory.index')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("Back")}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* Left: Identity */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-3">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold flex-shrink-0">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                      {business.is_verified && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">✓ {t("Verified")}</Badge>
                      )}
                      {business.is_featured && (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">⭐ {t("Featured")}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 capitalize mt-0.5">{business.business_type.replace(/-/g, ' ')}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {business.rating > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-700">{business.rating}</span>
                      <span className="text-xs text-amber-500">({business.rating_count})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                    <Eye className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-sm text-green-700 font-medium">{business.view_count} {t("views")}</span>
                  </div>
                </div>

                {/* Contact info row */}
                <div className="flex flex-wrap gap-2">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-blue-700 hover:text-blue-700 text-sm font-medium no-underline" style={{ textDecoration: 'none', color: '#1d4ed8' }}>
                      <Phone className="h-3.5 w-3.5" />
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 text-purple-700 hover:text-purple-700 text-sm font-medium no-underline" style={{ textDecoration: 'none', color: '#7e22ce' }}>
                      <Mail className="h-3.5 w-3.5" />
                      {contact.email}
                    </a>
                  )}
                  {contact.website && (
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5 text-yellow-700 hover:text-yellow-700 text-sm font-medium no-underline" style={{ textDecoration: 'none', color: '#a16207' }}>
                      <Globe className="h-3.5 w-3.5" />
                      {t("Website")}
                    </a>
                  )}

                  <button onClick={() => window.open(getBusinessUrl(), '_blank')} className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 text-primary text-sm font-medium">
                    <Globe className="h-3.5 w-3.5" />
                    {t("View Digital Card")}
                  </button>
                  {contact.address && (
                    <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-sm font-medium" style={{ color: '#c2410c' }}>
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate max-w-[220px]">{contact.address}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* About */}
              {about.description && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      {t("About")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-3 text-sm">{about.description}</p>
                    {getAboutExtras(about).length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getAboutExtras(about).map(([key, value]) => (
                          <div key={key} className="p-2 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-0.5 text-gray-500 text-xs capitalize">{key.replace(/_/g, ' ')}</h4>
                            <p className="text-gray-700 text-sm">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              {services.length > 0 && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      {business.business_type === 'doctor' ? 'Services' :
                        business.business_type === 'restaurant' ? 'Menu' : 'Services'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service: any, index: number) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                          <h4 className="font-medium mb-2 text-gray-800">{service.name || service.title}</h4>
                          {service.description && (
                            <p className="text-gray-600 mb-3 text-sm leading-relaxed">{service.description}</p>
                          )}
                          <div className="flex justify-between items-center">
                            {service.price && (
                              <span className="text-sm font-semibold text-green-600">{service.price}</span>
                            )}
                            {service.duration && (
                              <span className="text-xs text-gray-500">{service.duration}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Business Hours */}
              {hours.length > 0 && (
                <Card className="shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Clock className="h-4 w-4 text-orange-600" />
                      {t("Hours")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {hours.map((hour: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="capitalize text-sm text-gray-700">{hour.day}</span>
                          <span className={`text-sm font-medium ${hour.is_closed ? 'text-red-600' : 'text-green-600'}`}>
                            {hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}