<script lang="ts" module>
	import type { ColorType } from '@t/general';
	import type ClassProps from '@t/props/class';
	import type ClassChildrenProps from '@t/props/class_children';
	import { getColorTheme, getTextStyles } from '@utils/general';
	import type { Component } from 'svelte';

	interface Props extends ClassChildrenProps {
		text?: string;
		icon?: Component<ClassProps>;
		data?: Record<string, any>;
		disabled?: boolean;
		color?: ColorType;
		onclick?: (e: Event) => void;
		type?: 'submit' | 'button';
		as?: 'button' | 'a';
		href?: '';
	}
</script>

<script lang="ts">
	let { type, text = '', as = 'button', color = 'primary', icon: Icon, ...props }: Props = $props();

	const className = 'flex justify-center items-center space-x-2 rounded-xl px-4 py-2 min-h-[40px]';
	const textClasses = getTextStyles();
</script>

<svelte:element
	this={as}
	role="button"
	tabindex={0}
	href={props.href}
	onclick={props.onclick}
	disabled={props.disabled}
	class="{className} {getColorTheme(color, true)} {props.class}"
	{...props.data}
	{type}
>
	{#if text !== ''}
		<p class={textClasses}>
			{text}
		</p>
	{/if}
	<!--* Custom Icon *-->
	{#if !!Icon}
		<Icon class="{textClasses} size-4"></Icon>
	{/if}

	{#if props.children}
		{@render props.children()}
	{/if}
</svelte:element>
