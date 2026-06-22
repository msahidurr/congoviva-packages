import React from 'react';
import PlanForm from './form';

interface Addon {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface Props {
  hasDefaultPlan: boolean;
  availableAddons: Addon[];
}

export default function CreatePlan({ hasDefaultPlan, availableAddons }: Props) {
  return <PlanForm hasDefaultPlan={hasDefaultPlan} availableAddons={availableAddons} />;
}