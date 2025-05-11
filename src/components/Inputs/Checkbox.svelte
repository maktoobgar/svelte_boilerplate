<script lang="ts" module>
	import { uidGenerator } from '@utils/general';
	import Errors from './Errors.svelte';
	import type { ErrorType } from '@t/responses/error_response';
	import type ClassChildrenProps from '@t/props/class_children';

	interface Props extends ClassChildrenProps {
		name?: string;
		label?: string;
		title?: string;
		value?: boolean;
		disabled?: boolean;
		labelClass?: string;
		itemTitleClass?: string;
		errors?: ErrorType;
		onchanged?: ((name: string, v: boolean) => void) | null;
	}
</script>

<script lang="ts">
	let {
		title = '',
		value = $bindable(false),
		errors = $bindable({}),
		name = '',
		...props
	}: Props = $props();

	let deleteError = $state(() => {});

	let id: string = uidGenerator();
</script>

<div class={props.class}>
	{#if props.label}
		<label for={id} class={`cursor-pointer pb-1 ${props.labelClass}`}>
			{@html props.label}
		</label>
	{/if}

	<label class:!cursor-default={props.disabled} class="flex items-center space-x-3">
		<button
			type="button"
			aria-label="checkbox button"
			class:bg-primary-600={value}
			class:outline-primary-600={value}
			class:outline-slightly-muted-foreground={!value}
			class:!cursor-default={props.disabled && !value}
			class:outline-muted-foreground={props.disabled && !value}
			class:disabled:bg-gray-200={props.disabled && !value}
			class:dark:disabled:bg-gray-800={props.disabled && !value}
			class="size-3 rounded-xs outline outline-offset-2 ltr:ml-1 rtl:mr-1"
			onclick={() => {
				value = !value;
				props.onchanged && props.onchanged(name, value);
			}}
			disabled={props.disabled}
			{id}
		></button>

		<p class:text-muted-foreground={props.disabled && !value} class={props.itemTitleClass}>
			{#if props.children}
				{@render props.children()}
			{/if}
		</p>
	</label>

	<Errors bind:deleteError bind:errors {name} />
</div>
