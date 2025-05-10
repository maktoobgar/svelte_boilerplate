<script module>
	import type { ToastType } from '@t/toast/toast_type';
	import toast from '@stores/toast';
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import fadeOutSlide from '@anims/fade_out_slide';
	import fadeInSlide from '@anims/fade_in_slide';
	import type { Writable } from 'svelte/store';
	import type ClassProps from '@t/props/class';

	interface Props extends ClassProps {
		type: ToastType;
		duration: number;
		delete_me: Writable<() => void>;
		children?: Snippet;
	}
</script>

<script lang="ts">
	const { type, duration, delete_me, children }: Props = $props();

	let progress = $state(0);
	let active = $state(true);
	let height = $state(0);

	let interval: ReturnType<typeof setInterval>;
	let startTime: number;
	let remaining = duration;
	let parentDiv: HTMLDivElement | null = null;

	const updateProgress = () => {
		interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			remaining = duration - elapsed;
			progress = Math.max(0, Math.min(elapsed / duration, 1));
			if (progress === 1) {
				clearInterval(interval);
				height = parentDiv ? parentDiv.getBoundingClientRect().height : 0;
				active = false;
				$delete_me();
			}
		}, 16);
	};

	const start = () => {
		startTime = Date.now();
		updateProgress();
	};

	const resume = () => {
		if (progress !== 1) {
			// Date.now() - elapsed
			startTime = Date.now() - (duration - remaining);
			updateProgress();
		}
	};

	const pause = () => {
		if (progress !== 1) clearInterval(interval);
	};

	onMount(() => start());
	onDestroy(() => clearInterval(interval));
</script>

<div
	bind:this={parentDiv}
	class:animate-squash={!active}
	class:mt-2={active}
	out:fadeOutSlide={{
		side: $toast.startsWith('top') ? 'top' : 'bottom',
		height_squish: true,
		initial_height: height,
		margin_top_squish: true,
		initial_margin_top: 0.5
	}}
	in:fadeInSlide={{ side: $toast.startsWith('top') ? 'bottom' : 'top' }}
>
	<div
		role="alert"
		onmouseenter={() => {
			pause();
		}}
		onmouseleave={() => {
			resume();
		}}
		class={'overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800'}
	>
		{@render children?.()}
		<div
			class={`h-[1px]
                    ${type == 'success' ? 'bg-emerald-400' : ''}
                    ${type == 'info' ? 'bg-blue-400' : ''}
                    ${type == 'warning' ? 'bg-yellow-300' : ''}
                    ${type == 'error' ? 'bg-red-400' : ''}`}
		></div>
		<div
			style={`width: ${progress * 100}%`}
			class={`h-1
                    ${type == 'success' ? 'bg-emerald-400' : ''}
                    ${type == 'info' ? 'bg-blue-400' : ''}
                    ${type == 'warning' ? 'bg-yellow-300' : ''}
                    ${type == 'error' ? 'bg-red-400' : ''}`}
		></div>
	</div>
</div>
