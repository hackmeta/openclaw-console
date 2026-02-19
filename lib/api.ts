import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Instance,
  CreateInstanceRequest,
  LogEntry,
} from '@/types';

// Use empty base URL to leverage Next.js rewrites (proxy)
// In production, you can set NEXT_PUBLIC_API_URL env var
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_PREFIX = '/api/v1';

// Default tenant ID (can be overridden by JWT parsing)
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

// JWT payload interface
interface JWTPayload {
  sub: string;
  email: string;
  tenant_id?: string;
  exp: number;
  [key: string]: any;
}

// Helper function to decode JWT
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

class ApiClient {
  private getTenantId(): string {
    if (typeof window === 'undefined') return DEFAULT_TENANT_ID;
    
    const token = localStorage.getItem('token');
    if (!token) return DEFAULT_TENANT_ID;
    
    const payload = decodeJWT(token);
    return payload?.tenant_id || DEFAULT_TENANT_ID;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Request failed',
        message: response.statusText,
      }));
      throw new Error(error.message || error.error);
    }

    const result = await response.json();
    // Unwrap { data: ... } response format
    return result.data !== undefined ? result.data : result;
  }

  // Auth APIs
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token in localStorage
    if (typeof window !== 'undefined' && response.access_token) {
      localStorage.setItem('token', response.access_token);
    }
    
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<User> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot get profile on server side');
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    // Decode JWT to get user info
    const payload = decodeJWT(token);
    if (!payload) {
      throw new Error('Invalid token');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified,
      display_name: payload.display_name,
      roles: payload.roles,
    };
  }

  async verifyEmail(token: string): Promise<any> {
    return this.request<any>(`/auth/verify-email?token=${token}`, {
      method: 'POST',
    });
  }

  async resendVerification(): Promise<any> {
    return this.request<any>('/auth/resend-verification', {
      method: 'POST',
    });
  }

  // Instance APIs (mapped to Agent APIs)
  async getInstances(): Promise<Instance[]> {
    const tenantId = this.getTenantId();
    return this.request<Instance[]>(`/tenants/${tenantId}/agents`);
  }

  async getInstance(id: string): Promise<Instance> {
    const tenantId = this.getTenantId();
    return this.request<Instance>(`/tenants/${tenantId}/agents/${id}`);
  }

  async createInstance(data: CreateInstanceRequest): Promise<Instance> {
    const tenantId = this.getTenantId();
    return this.request<Instance>(`/tenants/${tenantId}/agents`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startInstance(id: string): Promise<Instance> {
    const tenantId = this.getTenantId();
    return this.request<Instance>(`/tenants/${tenantId}/agents/${id}/start`, {
      method: 'POST',
    });
  }

  async stopInstance(id: string): Promise<Instance> {
    const tenantId = this.getTenantId();
    return this.request<Instance>(`/tenants/${tenantId}/agents/${id}/stop`, {
      method: 'POST',
    });
  }

  async restartInstance(id: string): Promise<Instance> {
    // Restart = stop + start
    await this.stopInstance(id);
    return this.startInstance(id);
  }

  async deleteInstance(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    return this.request<void>(`/tenants/${tenantId}/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // Log APIs (placeholder - implement if backend supports)
  async getLogs(instanceId: string, limit = 100): Promise<LogEntry[]> {
    // TODO: Implement if backend has logs API
    return [];
  }

  async getInstanceLogs(instanceId: string, limit = 100): Promise<LogEntry[]> {
    // Mock data for now - replace with real API when available
    const mockLogs: LogEntry[] = [];
    const components = ['gateway', 'telegram', 'session', 'anthropic', 'rate-limit', 'websocket'];
    const levels: ('info' | 'warn' | 'error')[] = ['info', 'info', 'info', 'info', 'warn', 'error'];
    
    const messages = {
      gateway: [
        'listening on ws://[::1]:18789',
        'client connected from ::1',
        'heartbeat received',
        'connection upgraded to websocket',
      ],
      telegram: [
        'starting provider (@openclaw_bot)',
        'bot authenticated successfully',
        'received update from user',
        'message sent successfully',
      ],
      session: [
        'new session created',
        'session resumed from state',
        'session context loaded',
        'session terminated',
      ],
      anthropic: [
        'request completed (tokens: 1234)',
        'request completed (tokens: 2456)',
        'streaming response started',
        'model switched to claude-sonnet-4-5',
      ],
      'rate-limit': [
        'approaching quota limit (80%)',
        'quota reset in 3600s',
        'rate limit exceeded, waiting...',
      ],
      websocket: [
        'connection established',
        'ping/pong timeout',
        'reconnecting...',
      ],
    };

    const now = Date.now();
    const baseTime = now - 3600000; // 1 hour ago

    for (let i = 0; i < limit; i++) {
      const component = components[Math.floor(Math.random() * components.length)];
      const level = component === 'rate-limit' ? 'warn' 
                  : component === 'websocket' && Math.random() > 0.8 ? 'error'
                  : levels[Math.floor(Math.random() * levels.length)];
      
      const componentMessages = messages[component as keyof typeof messages] || ['operation completed'];
      const message = componentMessages[Math.floor(Math.random() * componentMessages.length)];
      
      mockLogs.push({
        id: `log-${i}`,
        instance_id: instanceId,
        level,
        component,
        message,
        timestamp: new Date(baseTime + (i * 36000)).toISOString(), // Spread over 1 hour
      });
    }

    // Sort by timestamp descending (newest first)
    return mockLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Health check API
  async getHealth(): Promise<{ data: Instance[]; stats: { total: number; healthy: number; unhealthy: number; error: number } }> {
    return this.request<any>('/admin/agents/health');
  }

  // Billing APIs (Mock for now - replace with real API calls later)
  private mockMode = true; // Set to false when backend is ready

  async getSubscription(): Promise<import('@/types').Subscription> {
    if (this.mockMode) {
      // Mock data
      return {
        plan: 'free',
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
      };
    }
    return this.request<import('@/types').Subscription>('/billing/subscription');
  }

  async getInvoices(): Promise<import('@/types').Invoice[]> {
    if (this.mockMode) {
      // Mock data - no invoices for free plan
      return [];
    }
    return this.request<import('@/types').Invoice[]>('/billing/invoices');
  }

  async createCheckoutSession(plan: 'pro' | 'business'): Promise<import('@/types').CheckoutSessionResponse> {
    if (this.mockMode) {
      // Mock: simulate redirect to success page
      return {
        checkout_url: '/billing?success=true',
      };
    }
    return this.request<import('@/types').CheckoutSessionResponse>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async createBillingPortal(): Promise<import('@/types').BillingPortalResponse> {
    if (this.mockMode) {
      // Mock: redirect back to billing
      return {
        portal_url: '/billing',
      };
    }
    return this.request<import('@/types').BillingPortalResponse>('/billing/portal', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
