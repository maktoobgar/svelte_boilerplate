<script lang="ts" module>
	import { uidGenerator } from '@utils/general';
	import type OptionItem from '@t/inputs/option_item';
	import type ClassProps from '@t/props/class';
	import Errors from './Errors.svelte';
	import type { ErrorType } from '@t/responses/error_response';

	interface Props extends ClassProps {
		name?: string;
		label?: string;
		value?: OptionItem | null;
		options?: OptionItem[];
		disabled?: boolean;
		labelClass?: string;
		groupClass?: string;
		optionTitleClass?: string;
		errors?: ErrorType;
		onchanged?: ((v: OptionItem | null) => void) | null;
	}
</script>

<script lang="ts">
	let { value = $bindable(null), errors = $bindable({}), name = '', ...props }: Props = $props();

	let deleteError = $state(() => {});

	let id: string = uidGenerator();
</script>

<div class={props.class}>
	{#if props.label}
		<label for={id} class={`cursor-pointer pb-1 ${props.labelClass}`}>
			{@html props.label}
		</label>
	{/if}

	<div class="flex flex-col {props.groupClass}">
		{#each props.options || [] as option}
			{@const disabled = props.disabled || option.item_disabled()}
			{@const selected = value === option}
			<label class:!cursor-default={disabled} class="flex items-center space-x-3">
				<button
					aria-label="radio button"
					class:bg-primary-600={selected}
					class:outline-primary-600={selected}
					class:outline-slightly-muted-foreground={!selected}
					class:!cursor-default={disabled && !selected}
					class:outline-muted-foreground={disabled && !selected}
					class:disabled:bg-gray-200={disabled && !selected}
					class:dark:disabled:bg-gray-800={disabled && !selected}
					class="size-3 rounded-full outline outline-offset-2 ltr:ml-1 rtl:mr-1"
					onclick={() => {
						value = props.options?.find((v) => v.item_id() === option.item_id()) || null;
						props.onchanged && props.onchanged(value);
					}}
					{disabled}
					{id}
				></button>

				<p class:text-muted-foreground={disabled && !selected} class={props.optionTitleClass}>
					{option.item_title()}
				</p>
			</label>
		{/each}
	</div>

	<Errors bind:deleteError bind:errors {name} />
</div>
