<script lang="ts" module>
	import IntersectionObserver from 'svelte-intersection-observer';
	import { clickOutside, uidGenerator } from '@utils/general';
	import scaleFade from '@/animations/scale_fade';
	import { fade, fly } from 'svelte/transition';
	import global from '@stores/global';
	import type { DropdownProps } from './type';
	import type { Snippet } from 'svelte';
	import { SM } from '@t/window/window_sizes';

	interface Props extends DropdownProps {
		content?: Snippet | null;
	}
</script>

<script lang="ts">
	let {
		id = uidGenerator(),
		openReverse = false,
		open = $bindable(false),
		distanceMenu = '8',
		transition = 'scale',
		content = null,
		...props
	}: Props = $props();

	const width = global.width;

	let openClasses = $derived(openReverse ? 'rtl:left-0 ltr:right-0' : 'ltr:left-0 rtl:right-0');
	let transitionFnc = $derived($width < 640 ? fly : transition === 'scale' ? scaleFade : fly);
	let params = $derived(
		$width < 640
			? { duration: 500, y: '100%' }
			: transition === 'scale'
				? { duration: 100 }
				: { duration: 100, y: -10 }
	);

	let divWidth = $state(0);
	let divHeight = $state(0);
	let topDiv: HTMLDivElement | null = $state(null);
	let bottomDiv: HTMLDivElement | null = $state(null);
	let topVisible = $state(true);
	let bottomVisible = $state(true);

	const clickOutsideFn = () => (open = false);
</script>

<div class="relative inline-block {props.class}">
	<div data-ignore-click-outside={id} class="contents">
		{#if props.children}
			{@render props.children()}
		{/if}
	</div>

	<!-- * Dropdown menu * -->
	{#if open && content}
		<div
			class="bg-white-glass-10 fixed inset-0 z-[1000] backdrop-blur-sm sm:hidden"
			transition:fade={{ duration: 100 }}
		></div>

		<div
			{id}
			bind:clientWidth={divWidth}
			bind:clientHeight={divHeight}
			use:clickOutside(clickOutsideFn)
			data-open-reverse={openReverse}
			transition:transitionFnc={params}
			style:margin-top={$width < SM
				? '0'
				: openReverse
					? topVisible
						? ''
						: `${distanceMenu}px`
					: bottomVisible
						? `${distanceMenu}px`
						: ''}
			style:margin-bottom={$width < SM
				? '0'
				: openReverse
					? topVisible
						? `${distanceMenu}px`
						: ''
					: bottomVisible
						? ''
						: `${distanceMenu}px`}
			class="shadow-custom bg-slightly-muted-background fixed inset-x-0 z-[1000] flex flex-col overflow-hidden max-sm:bottom-0 sm:absolute sm:w-fit sm:rounded-xl ltr:origin-top-left ltr:data-[open-reverse=true]:origin-top-right rtl:origin-top-right rtl:data-[open-reverse=true]:origin-top-left {openReverse
				? topVisible
					? `mb-[${distanceMenu}px] bottom-full`
					: ''
				: bottomVisible
					? ''
					: `mb-[${distanceMenu}px] bottom-full`} {openClasses} {props.menuClass}"
		>
			{@render content()}
		</div>

		<IntersectionObserver element={topDiv} bind:intersecting={topVisible}>
			<div
				style:width="{divWidth}px"
				style:height="{divHeight}px"
				style:margin-bottom="{distanceMenu}px"
				class="pointer-events-none invisible absolute bottom-full z-[1001] hidden overflow-hidden bg-amber-300 sm:flex ltr:origin-top-left ltr:data-[open-reverse=true]:origin-top-right rtl:origin-top-right rtl:data-[open-reverse=true]:origin-top-left {openClasses}"
			>
				<div class="h-1 w-full bg-red-400" bind:this={topDiv}></div>
			</div>
		</IntersectionObserver>

		<IntersectionObserver element={bottomDiv} bind:intersecting={bottomVisible}>
			<div
				style:width="{divWidth}px"
				style:height="{divHeight}px"
				style:margin-top="{distanceMenu}px"
				class="pointer-events-none invisible absolute z-[1001] items-end overflow-hidden bg-amber-300 sm:flex ltr:origin-top-left ltr:data-[open-reverse=true]:origin-top-right rtl:origin-top-right rtl:data-[open-reverse=true]:origin-top-left {openClasses}"
			>
				<div class="h-1 w-full bg-red-400" bind:this={bottomDiv}></div>
			</div>
		</IntersectionObserver>
	{/if}
</div>
