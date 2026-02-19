// Billing & Subscription Management

export type PlanTier = 'free' | 'pro' | 'business';

export interface PlanFeatures {
  maxInstances: number;
  models: string[];
  features: string[];
  support: string;
}

export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  priceId: string; // Stripe Price ID
  displayPrice: string;
  features: PlanFeatures;
  popular?: boolean;
}

// Plan definitions
export const PLANS: Record<PlanTier, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: 'price_free',
    displayPrice: '$0',
    features: {
      maxInstances: 1,
      models: ['yunwu/gpt-4o-mini'],
      features: [
        '1 Instance',
        'GPT-4o-mini only',
        'Community support',
        '1,000 messages/month',
      ],
      support: 'Community',
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    priceId: 'price_pro_monthly',
    displayPrice: '$19',
    popular: true,
    features: {
      maxInstances: 3,
      models: ['yunwu/gpt-4o-mini', 'yunwu/gpt-4o', 'anthropic/claude-sonnet-4-5'],
      features: [
        '3 Instances',
        'All models',
        'Priority support',
        '50,000 messages/month',
      ],
      support: 'Priority',
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 49,
    priceId: 'price_business_monthly',
    displayPrice: '$49',
    features: {
      maxInstances: 10,
      models: ['yunwu/gpt-4o-mini', 'yunwu/gpt-4o', 'anthropic/claude-sonnet-4-5'],
      features: [
        '10 Instances',
        'All models',
        '24/7 Priority support',
        'Unlimited messages',
      ],
      support: '24/7 Priority',
    },
  },
};

// Helper to get plan by tier
export function getPlan(tier: PlanTier): Plan {
  return PLANS[tier];
}

// Check if user can create more instances
export function canCreateInstance(currentPlan: PlanTier, currentInstanceCount: number): boolean {
  const plan = getPlan(currentPlan);
  return currentInstanceCount < plan.features.maxInstances;
}

// Check if model is available for plan
export function isModelAvailable(currentPlan: PlanTier, model: string): boolean {
  const plan = getPlan(currentPlan);
  return plan.features.models.includes(model);
}

// Get remaining instance slots
export function getRemainingSlots(currentPlan: PlanTier, currentInstanceCount: number): number {
  const plan = getPlan(currentPlan);
  return Math.max(0, plan.features.maxInstances - currentInstanceCount);
}

// Get suggested upgrade plan
export function getSuggestedUpgrade(currentPlan: PlanTier): PlanTier | null {
  if (currentPlan === 'free') return 'pro';
  if (currentPlan === 'pro') return 'business';
  return null; // Already on highest plan
}
