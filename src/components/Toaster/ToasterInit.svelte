<script module lang="ts">
	import type ClassProps from '@t/props/class';
	import toast from '@stores/toast';
	import type { ToastPosition } from '@t/toast/toast_position';

	interface Props extends ClassProps {
		where: ToastPosition;
	}
</script>

<script lang="ts">
	const { where = 'top' }: Props = $props();

	toast.set(where);
</script>

<div
	id="toaster"
	data-where={where}
	class={`group pointer-events-none fixed z-[10000] flex flex-col p-3
            ${where.startsWith('bottom') ? 'flex-col-reverse space-y-reverse' : ''}
            ${where === 'top' ? 'top-0 left-1/2 -translate-x-1/2' : ''}
            ${where === 'bottom' ? 'bottom-0 left-1/2 -translate-x-1/2' : ''}
            ${where === 'right' ? 'top-1/2 right-0 -translate-y-1/2' : ''}
            ${where === 'left' ? 'top-1/2 left-0 -translate-y-1/2' : ''}
            ${where === 'top_right' ? 'top-0 right-0' : ''}
            ${where === 'top_left' ? 'top-0 left-0' : ''}
            ${where === 'bottom_right' ? 'right-0 bottom-0' : ''}
            ${where === 'bottom_left' ? 'bottom-0 left-0' : ''}`}
></div>
