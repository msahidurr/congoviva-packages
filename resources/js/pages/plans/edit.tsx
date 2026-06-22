import React from 'react';
import PlanForm from './form';

interface Plan {
  id: number;
  name: string;
  price: number;
  yearly_price: number | null;
  duration: string;
  description: string | null;
  business: number;
  max_users: number;
  storage_limit: number;
  enable_custdomain: string;
  enable_custsubdomain: string;
  pwa_business: string;
  enable_chatgpt: string;
  themes: string[] | null;
  addons: number[] | null;
  is_trial: string | null;
  trial_day: number;
  is_plan_enable: string;
  is_default: boolean;
}

interface Addon {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface Props {
  plan: Plan;
  otherDefaultPlanExists: boolean;
  availableAddons: Addon[];
}

export default function EditPlan({ plan, otherDefaultPlanExists, availableAddons }: Props) {
  return <PlanForm plan={plan} otherDefaultPlanExists={otherDefaultPlanExists} availableAddons={availableAddons} />;
}