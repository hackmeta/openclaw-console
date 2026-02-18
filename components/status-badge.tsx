import type { InstanceStatus } from '@/types';

interface StatusBadgeProps {
  status: InstanceStatus;
}

const statusConfig = {
  running: {
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: '●',
    label: 'Running',
  },
  stopped: {
    color: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    icon: '●',
    label: 'Stopped',
  },
  error: {
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: '●',
    label: 'Error',
  },
  starting: {
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: '◐',
    label: 'Starting',
  },
  stopping: {
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: '◐',
    label: 'Stopping',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.color}`}
    >
      <span className="animate-pulse">{config.icon}</span>
      {config.label}
    </span>
  );
}
