// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Instance types
export type InstanceStatus = 'running' | 'stopped' | 'error' | 'starting' | 'stopping';

export type ModelType = 'Claude' | 'GPT' | 'Gemini' | 'Kimi';

export type ChannelType = 'Telegram';

export type PlanType = 'Free' | 'Pro' | 'Business';

export interface Instance {
  id: string;
  user_id: string;
  name: string;
  model: ModelType;
  channel: ChannelType;
  bot_token: string;
  plan: PlanType;
  status: InstanceStatus;
  ip?: string;
  created_at: string;
  updated_at: string;
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
  token: string;
  user: User;
}

export interface CreateInstanceRequest {
  name: string;
  model: ModelType;
  channel: ChannelType;
  bot_token: string;
  plan: PlanType;
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
}
