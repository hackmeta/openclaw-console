import type { Instance, User, LogEntry } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  created_at: '2024-01-01T00:00:00Z',
};

export const mockInstances: Instance[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Production Bot',
    model: 'Claude',
    channel: 'Telegram',
    bot_token: '123456:ABC-DEF',
    plan: 'Pro',
    status: 'running',
    ip: '192.168.1.100',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-18T15:30:00Z',
  },
  {
    id: '2',
    user_id: '1',
    name: 'Test Bot',
    model: 'GPT',
    channel: 'Telegram',
    bot_token: '789012:GHI-JKL',
    plan: 'Free',
    status: 'stopped',
    created_at: '2024-02-01T12:00:00Z',
    updated_at: '2024-02-18T14:00:00Z',
  },
  {
    id: '3',
    user_id: '1',
    name: 'Customer Support',
    model: 'Gemini',
    channel: 'Telegram',
    bot_token: '345678:MNO-PQR',
    plan: 'Business',
    status: 'error',
    ip: '192.168.1.102',
    created_at: '2024-02-10T08:00:00Z',
    updated_at: '2024-02-18T16:00:00Z',
  },
];

export const mockLogs: LogEntry[] = [
  {
    id: '1',
    instance_id: '1',
    level: 'info',
    message: 'Instance started successfully',
    timestamp: '2024-02-18T15:30:00Z',
  },
  {
    id: '2',
    instance_id: '1',
    level: 'info',
    message: 'Telegram connection established',
    timestamp: '2024-02-18T15:30:05Z',
  },
  {
    id: '3',
    instance_id: '1',
    level: 'warn',
    message: 'High memory usage detected',
    timestamp: '2024-02-18T16:00:00Z',
  },
];
