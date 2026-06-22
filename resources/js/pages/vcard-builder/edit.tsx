import React from 'react';
import VCardBuilderForm from './form';

interface Business {
  id: number;
  name: string;
  slug: string;
  business_type: string;
  config_sections: any;
  custom_domain?: string;
  url_prefix?: string;
  password?: string;
  password_enabled?: boolean;
  domain_type?: 'slug' | 'subdomain' | 'domain';
}

interface Props {
  business: Business;
  userPlan?: any;
  userRole?: string;
  planFeatures?: any;
}

export default function VCardBuilderEdit({ business, userPlan, userRole, planFeatures }: Props) {
  return <VCardBuilderForm business={business} userPlan={userPlan} userRole={userRole} planFeatures={planFeatures} />;
}