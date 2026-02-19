// User types
export interface User {
  id: string;
  email: string;
  display_name?: string;
  roles?: string[];
  created_at?: string;
}

// Instance types (mapped from Agent)
export type InstanceStatus = 'running' | 'stopped' | 'error' | 'starting' | 'stopping';

export type ModelType = 'yunwu/gpt-4o-mini' | 'yunwu/gpt-4o' | 'anthropic/claude-sonnet-4-5';

export type ChannelType = 'telegram' | 'discord' | 'whatsapp';

export type PlanType = 'Free' | 'Pro' | 'Business';

export interface Instance {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status: InstanceStatus;
  llm_provider?: string;
  llm_model?: string;
  channel_type?: ChannelType;
  vm_ip?: string;
  created_at: string;
  started_at?: string;
  vm_cpu?: number;
  vm_memory_mb?: number;
  // Legacy fields for compatibility
  model?: ModelType;
  channel?: ChannelType;
  bot_token?: string;
  plan?: PlanType;
  ip?: string;
  updated_at?: string;
}

// API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ChannelConfig {
  bot_token_secret_id?: string;
  guild_id?: string;
  phone_number?: string;
}

export interface CreateInstanceRequest {
  name: string;
  description?: string;
  type: 'channel';
  llm_provider: string;
  llm_model: string;
  channel_type: ChannelType;
  channel_config: ChannelConfig;
  vm_template: string;
  vm_cpu: number;
  vm_memory_mb: number;
  vm_disk_gb: number;
}

export interface ApiError {
  error: string;
  message?: string;
}

// Log types
export interface LogEntry {
  id: string;
  instance_id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  component?: string; // e.g., 'gateway', 'telegram', 'session'
}

// Billing types
export type PlanTier = 'free' | 'pro' | 'business';

export interface Subscription {
  plan: PlanTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created_at: string;
  pdf_url?: string;
}

export interface CheckoutSessionRequest {
  plan: Exclude<PlanTier, 'free'>; // Can't checkout for free plan
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

export interface BillingPortalResponse {
  portal_url: string;
}
