import React from 'react';
import BioLinkForm from './form';

interface BioLink {
  id: number;
  name: string;
  slug: string;
  link_type: string;
  config: any;
  custom_domain?: string;
  url_prefix?: string;
  password?: string;
  password_enabled?: boolean;
}

interface Props {
  bioLink: BioLink;
  userPlan?: any;
  planFeatures?: any;
  userRole?: string;
}

export default function EditBioLink({ bioLink, userPlan, userRole, planFeatures }: Props) {
  return <BioLinkForm bioLink={bioLink} userPlan={userPlan} planFeatures={planFeatures} userRole={userRole} />;
}