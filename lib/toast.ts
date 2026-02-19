export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

class ToastManager {
  private listeners: ((toast: ToastMessage) => void)[] = [];

  subscribe(listener: (toast: ToastMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private show(message: string, type: ToastType) {
    const toast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}

export const toast = new ToastManager();
