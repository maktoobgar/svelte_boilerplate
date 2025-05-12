<script lang="ts" module>
	import IntersectionObserver from 'svelte-intersection-observer';
	import { clickOutside, convertToOptionItem, convertToT, uidGenerator } from '@utils/general';
	import Empty from '@icons/Empty.svelte';
	import LL from '@i18n/i18n-svelte';
	import OptionItem from '@/types/inputs/option_item';
	import { type ErrorType } from '@/types/responses/error_response';
	import Errors from './Errors.svelte';
	import Button from './Button.svelte';
	import type ClassProps from '@t/props/class';
	import type { Component } from 'svelte';
	import fadeInSlide from '@anims/fade_in_slide';

	interface Props<T> extends ClassProps {
		name?: string;
		label?: string;
		options?: T[];
		value?: T | null;
		icon?: Component<ClassProps>;
		errors?: ErrorType;
		placeholder?: string;
		hint?: string;
		iconClass?: string;
		inputClass?: string;
		labelClass?: string;
		inputValue?: string;
		hintClass?: string;
		disabled?: boolean;
		open?: boolean;
		top?: boolean;
		onchanged?: ((v: T | null) => void) | null;
	}
</script>

<!-- svelte-ignore non_reactive_update -->
<script lang="ts" generics="T extends OptionItem">
	let deleteError: () => void;

	let {
		name = '',
		label = '',
		options = [],
		value = $bindable(null),
		errors = {},
		placeholder = '',
		inputClass = '',
		labelClass = '',
		inputValue = '',
		open = false,
		top = false,
		icon: Icon,
		disabled = false,
		onchanged = null,
		...props
	}: Props<T> = $props();

	let topVisible = $state(true);
	let bottomVisible = $state(true);
	let clientWidth = $state(0);
	let clientHeight = $state(0);

	const id = uidGenerator();

	let topDiv: HTMLDivElement | null = $state(null);
	let bottomDiv: HTMLDivElement | null = $state(null);

	const internalOptions = $derived(options.map((v) => convertToOptionItem(v)));
	const inputValueLowercase = $derived(inputValue.toLowerCase());
	const filteredOptions = $derived(
		internalOptions.filter((v) => v.item_title().toLowerCase().includes(inputValueLowercase))
	);

	const optionClick = (item: OptionItem) => {
		deleteError();
		value = convertToT<T>(item);
		onchanged && onchanged(value);
		open = false;
		inputValue = '';
	};

	const clickOutsideFunc = () => {
		open = false;
		inputValue = '';
	};
</script>

<div
	use:clickOutside(clickOutsideFunc)
	data-open={open}
	class={`group relative flex flex-col ${props.class}`}
>
	{#if label.length !== 0}
		<button
			class="mb-2 w-fit"
			onclick={() => {
				if (!disabled) open = true;
			}}
			{disabled}
		>
			<label
				aria-disabled={disabled}
				for={id}
				class={`pb-1 select-none aria-disabled:!cursor-default ${labelClass}`}
			>
				{label}
			</label>
		</button>
	{/if}

	<div
		class:ltr:pl-10={!!Icon}
		class:rtl:pr-11={!!Icon}
		class="border-border bg-background ring-offset-background placeholder:text-slightly-muted-foreground focus-within:ring-ring relative rounded-xl border px-3 py-2 outline-none focus-within:ring-2 focus-within:ring-offset-2 has-disabled:cursor-default has-disabled:bg-gray-200 has-disabled:opacity-50 sm:text-sm dark:has-disabled:bg-gray-800 {inputClass}"
	>
		<!--* Custom Icon *-->
		{#if !!Icon}
			<Icon
				class="text-slightly-muted-foreground absolute inset-x-3 top-1/2 size-4 -translate-y-1/2 {props.iconClass}"
			/>
		{/if}

		<div class="flex h-full w-full items-center">
			{#if value}
				<button
					onclick={() => (open = !open)}
					class="bg-background relative h-full w-full capitalize ltr:text-left rtl:text-right"
					{disabled}
				>
					{value.item_title()}
					<Button
						class="absolute top-1/2 size-6 !min-h-auto -translate-y-1/2 rounded-full !p-1 ltr:right-1 rtl:left-1"
						color=""
						onclick={(e) => {
							onchanged && onchanged(null);
							e.stopPropagation();
							open = false;
							deleteError();
							value = null;
						}}
						{disabled}
					>
						{#snippet children()}
							<svg class="fill-foreground size-4" viewBox="0 0 384 512">
								<path
									d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
								/>
							</svg>
						{/snippet}
					</Button>
				</button>
			{:else}
				<input
					{id}
					{placeholder}
					bind:value={inputValue}
					onfocus={() => (open = true)}
					{disabled}
					class="flex-grow border-gray-200 capitalize outline-none placeholder:text-gray-500 sm:text-sm"
				/>
			{/if}

			{#if open}
				<div
					bind:clientWidth
					bind:clientHeight
					transition:fadeInSlide={{ side: 'top', duration: 100, percentage: 10 }}
					class="bg-background border-border absolute inset-x-0 z-[1] max-h-[200px] overflow-y-scroll rounded-xl border {top
						? topVisible
							? 'bottom-full mb-3'
							: 'top-full mt-3'
						: bottomVisible
							? 'top-full mt-3'
							: 'bottom-full mb-3'}"
				>
					{#if filteredOptions.length > 0}
						{#each filteredOptions as item, index (item.item_id())}
							{@const isSelected = filteredOptions[index] === value}
							<button
								onclick={() => optionClick(item)}
								class:bg-background={!isSelected}
								class:bg-secondary-100={isSelected}
								class:dark:bg-secondary-900={isSelected}
								class="border-b-border flex w-full items-center !justify-start !rounded-none border-b px-3 py-2 capitalize last:border-b-0"
								type="button"
							>
								<p>{item.item_title()}</p>
							</button>
						{/each}
					{:else}
						<div class="flex items-center justify-center space-x-5 p-5">
							<h6 class="whitespace-nowrap select-none">
								{$LL.Components.MultiSelect.NoItems()}...
							</h6>
							<Empty class="fill-black-700 h-[30px] w-[30px] md:h-[50px] md:w-[50px]" />
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<IntersectionObserver element={topDiv} bind:intersecting={topVisible}>
			<div
				style:height="{clientHeight}px"
				style:width="{clientWidth}px"
				class="pointer-events-none invisible absolute inset-x-0 bottom-full z-[2] mb-3 flex items-start bg-amber-300"
			>
				<div id="topDiv" class="w-full bg-red-400" bind:this={topDiv}></div>
			</div>
		</IntersectionObserver>

		<IntersectionObserver element={bottomDiv} bind:intersecting={bottomVisible}>
			<div
				style:height="{clientHeight}px"
				style:width="{clientWidth}px"
				class="pointer-events-none invisible absolute inset-x-0 top-full z-[2] mt-3 flex items-end bg-red-400"
			>
				<div id="bottomDiv" class="w-full bg-amber-300" bind:this={bottomDiv}></div>
			</div>
		</IntersectionObserver>
	</div>

	{#if !!props.hint}
		<p class="pt-2 text-sm text-gray-400 {props.hintClass}">{props.hint}</p>
	{/if}

	<Errors bind:deleteError bind:errors {name} />
</div>
