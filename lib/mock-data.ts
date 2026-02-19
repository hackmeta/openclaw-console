import type { Instance, User, LogEntry } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  created_at: '2024-01-01T00:00:00Z',
};

export const mockInstances: Instance[] = [
  {
    id: '1',
    name: 'Production Bot',
    status: 'running',
    llm_provider: 'anthropic',
    llm_model: 'claude-sonnet-4-5',
    channel_type: 'telegram',
    vm_ip: '192.168.1.100',
    created_at: '2024-01-15T10:00:00Z',
    started_at: '2024-02-18T15:30:00Z',
    vm_cpu: 2,
    vm_memory_mb: 2048,
  },
  {
    id: '2',
    name: 'Test Bot',
    status: 'stopped',
    llm_provider: 'yunwu',
    llm_model: 'gpt-4o-mini',
    channel_type: 'telegram',
    created_at: '2024-02-01T12:00:00Z',
    vm_cpu: 1,
    vm_memory_mb: 1024,
  },
  {
    id: '3',
    name: 'Customer Support',
    status: 'error',
    llm_provider: 'yunwu',
    llm_model: 'gpt-4o',
    channel_type: 'telegram',
    vm_ip: '192.168.1.102',
    created_at: '2024-02-10T08:00:00Z',
    vm_cpu: 2,
    vm_memory_mb: 2048,
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
