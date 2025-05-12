<script lang="ts" module>
	import easeOut from '@anims/easings';
	import type ClassChildrenProps from '@t/props/class_children';
	import { fade, fly } from 'svelte/transition';

	interface Props extends ClassChildrenProps {
		contentClass?: string;
		closeWhenClickBackground?: boolean;
		open?: boolean;
		as?: string;
		onsubmit?: () => void;
		fullScreenOnSmallWindow?: boolean;
	}
</script>

<script lang="ts">
	import { preventDefault, stopPropagation } from '@utils/general';

	let {
		closeWhenClickBackground = true,
		open = $bindable(false),
		as = 'form',
		fullScreenOnSmallWindow = false,
		...props
	}: Props = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		role="form"
		transition:fade={{ duration: 300, easing: easeOut }}
		onclick={closeWhenClickBackground ? stopPropagation((e) => (open = false)) : null}
		class={`group bg-white-glass-10 fixed inset-0 z-20 flex justify-center overflow-y-auto backdrop-blur-lg outline-none ${fullScreenOnSmallWindow ? 'sm:items-center' : 'items-center'} ${props.class}`}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<svelte:element
			this={as}
			role="form"
			transition:fly={{ duration: 300, y: 30, easing: easeOut }}
			onsubmit={preventDefault(stopPropagation(() => props.onsubmit && props.onsubmit()))}
			onclick={stopPropagation(() => {})}
			class="bg-muted-background shadow-custom dark:shadow-custom-dark flex p-5 {fullScreenOnSmallWindow
				? 'items-center justify-center max-sm:flex-grow sm:rounded-2xl'
				: 'rounded-2xl'} {props.contentClass}"
		>
			{#if props.children}
				{@render props.children()}
			{/if}
		</svelte:element>
	</div>
{/if}
