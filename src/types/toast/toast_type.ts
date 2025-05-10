export const ToastTypes = ['success', 'info', 'warning', 'error'] as const;
export type ToastType = (typeof ToastTypes)[number];
