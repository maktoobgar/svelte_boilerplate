<script lang="ts" module>
	import type ClassChildrenProps from '@t/props/class_children';
	import { fade } from 'svelte/transition';

	interface Props extends ClassChildrenProps {
		text?: string;
		hover?: boolean;
		// left and right off the box has to be done by code
		xDirection?: 'left' | 'right' | 'center';
		// ignore center, top and bottom works fine
		yDirection?: 'top' | 'bottom' | 'center';
	}
</script>

<script lang="ts">
	let {
		text = 'This is a tooltip',
		hover = false,
		xDirection = 'center',
		yDirection = 'top',
		...props
	}: Props = $props();

	let contentWidth: number = $state(0);
	let contentHeight: number = $state(0);
	let tooltipWidth: number = $state(0);
	let tooltipHeight: number = $state(0);

	let left: number | null = $derived(
		xDirection === 'left' && yDirection === 'center'
			? -tooltipWidth - 30
			: xDirection === 'left'
				? -tooltipWidth + 30
				: xDirection === 'center'
					? contentWidth / 2 - tooltipWidth / 2
					: null
	);
	let right: number | null = $derived(
		xDirection === 'right' && yDirection === 'center'
			? -tooltipWidth - 30
			: xDirection === 'right'
				? -tooltipWidth + 30
				: null
	);
	let top: number | null = $derived(
		yDirection === 'top'
			? -tooltipHeight - 20
			: yDirection === 'center'
				? contentHeight / 2 - tooltipHeight / 2
				: null
	);
	let bottom: number | null = $derived(yDirection === 'bottom' ? -tooltipHeight - 20 : null);
</script>

<div
	class="relative inline-block cursor-pointer {props.class}"
	onmouseenter={() => (hover = true)}
	onmouseleave={() => (hover = false)}
	bind:clientWidth={contentWidth}
	bind:clientHeight={contentHeight}
	role="tooltip"
>
	{#if props.children}
		{@render props.children()}
	{/if}

	{#if hover}
		<p
			bind:clientWidth={tooltipWidth}
			bind:clientHeight={tooltipHeight}
			class="bg-primary-500 dark:bg-primary-700 absolute z-[10] flex max-w-[300px] items-center justify-center rounded-lg p-3 text-gray-600 shadow-lg"
			style={`left: ${left !== null ? left + 'px' : 'auto'}; right: ${right !== null ? right + 'px' : 'auto'}; top: ${top !== null ? top + 'px' : 'auto'}; bottom: ${bottom !== null ? bottom + 'px' : 'auto'};`}
			in:fade={{ duration: 200, delay: 100 }}
			out:fade={{ duration: 200 }}
		>
			<span class="truncate text-white">{@html text}</span>

			<svg
				data-x-direction={xDirection}
				data-y-direction={yDirection}
				class="fill-primary-500 dark:fill-primary-700 absolute -mb-3 size-[28px] transform text-white drop-shadow-lg data-[x-direction=center]:left-1/2 data-[x-direction=center]:-translate-x-1/2 data-[x-direction=left]:right-[6px] data-[x-direction=right]:left-[6px] data-[y-direction=bottom]:bottom-[101%] data-[y-direction=bottom]:rotate-180 data-[y-direction=bottom]:drop-shadow-none data-[y-direction=center]:top-1/2 data-[y-direction=center]:-translate-y-1/2 data-[y-direction=center]:data-[x-direction=left]:-right-[16px] data-[y-direction=center]:data-[x-direction=left]:-rotate-90 data-[y-direction=center]:data-[x-direction=right]:-left-[16px] data-[y-direction=center]:data-[x-direction=right]:rotate-90 data-[y-direction=top]:-bottom-0.5"
				viewBox="0 0 320 512"
			>
				<path
					d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
				/>
			</svg>
		</p>
	{/if}
</div>
