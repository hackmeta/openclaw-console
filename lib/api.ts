import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Instance,
  CreateInstanceRequest,
  LogEntry,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const API_PREFIX = '/api/v1';

class ApiClient {
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

    return response.json();
  }

  // Auth APIs
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // Instance APIs
  async getInstances(): Promise<Instance[]> {
    return this.request<Instance[]>('/instances');
  }

  async getInstance(id: string): Promise<Instance> {
    return this.request<Instance>(`/instances/${id}`);
  }

  async createInstance(data: CreateInstanceRequest): Promise<Instance> {
    return this.request<Instance>('/instances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startInstance(id: string): Promise<Instance> {
    return this.request<Instance>(`/instances/${id}/start`, {
      method: 'POST',
    });
  }

  async stopInstance(id: string): Promise<Instance> {
    return this.request<Instance>(`/instances/${id}/stop`, {
      method: 'POST',
    });
  }

  async restartInstance(id: string): Promise<Instance> {
    return this.request<Instance>(`/instances/${id}/restart`, {
      method: 'POST',
    });
  }

  async deleteInstance(id: string): Promise<void> {
    return this.request<void>(`/instances/${id}`, {
      method: 'DELETE',
    });
  }

  // Log APIs
  async getLogs(instanceId: string, limit = 100): Promise<LogEntry[]> {
    return this.request<LogEntry[]>(
      `/instances/${instanceId}/logs?limit=${limit}`
    );
  }
}

export const api = new ApiClient();
