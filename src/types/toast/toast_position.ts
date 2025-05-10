export const ToastPositions = [
	'top',
	'bottom',
	'right',
	'left',
	'top_right',
	'top_left',
	'bottom_right',
	'bottom_left'
] as const;

export type ToastPosition = (typeof ToastPositions)[number];
