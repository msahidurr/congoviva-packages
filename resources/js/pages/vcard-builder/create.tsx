import React from 'react';
import VCardBuilderForm from './form';

interface Props {
  userPlan?: any;
  userRole?: string;
  planFeatures?: any;
}

export default function VCardBuilderCreate({ userPlan, userRole, planFeatures }: Props) {
  return <VCardBuilderForm userPlan={userPlan} userRole={userRole} planFeatures={planFeatures} />;
}