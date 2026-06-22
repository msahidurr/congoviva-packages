import React from 'react';
import BioLinkForm from './form';

interface Props {
  userPlan?: any;
  userRole?: string;
  planFeatures?: any;
}

export default function CreateBioLink({ userPlan, userRole, planFeatures }: Props) {
  return <BioLinkForm userPlan={userPlan} userRole={userRole} planFeatures={planFeatures} />;
}