<script module lang="ts">
	import type ClassProps from '@t/props/class';
	import type { Component } from 'svelte';
	import Errors from './Errors.svelte';
	import type { ErrorType } from '@t/responses/error_response';
	import { uidGenerator } from '@utils/general';

	type InputTextType = 'text' | 'email' | 'password' | 'number' | 'textarea';

	interface Props extends ClassProps {
		id?: string;
		name?: string;
		label?: string;
		value?: string;
		type?: InputTextType;
		icon?: Component<ClassProps>;
		hint?: string;
		disabled?: boolean;
		placeholder?: string;
		inputClass?: string;
		labelClass?: string;
		hintClass?: string;
		errors?: ErrorType;
		onfocus?: () => void;
	}
</script>

<script lang="ts">
	let {
		id = uidGenerator(),
		value = $bindable(),
		type = 'text',
		name = '',
		icon: Icon,
		errors = $bindable({}),
		disabled = false,
		...props
	}: Props = $props();

	let showPassword = $state(false);
	let deleteError = $state(() => {});

	let className =
		'border-border bg-background ring-offset-background placeholder:text-slightly-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-xl border px-3 py-2 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none disabled:cursor-default disabled:opacity-50 disabled:bg-gray-200 dark:disabled:bg-gray-800';
</script>

<div class={props.class} onfocus={props.onfocus}>
	{#if props.label}
		<div class="mb-2">
			<label for={id} class={`cursor-pointer ${props.labelClass}`}>
				{@html props.label}
			</label>
		</div>
	{/if}

	{#if !!props.hint && type === 'textarea'}
		<p class="pb-1 text-sm text-gray-400 {props.hintClass}">{props.hint}</p>
	{/if}

	<div class="relative">
		<!--* Custom Icon *-->
		{#if !!Icon}
			<Icon
				class="text-slightly-muted-foreground absolute inset-x-3 top-1/2 size-4 -translate-y-1/2"
			/>
		{/if}

		<!--* Input Itself *-->
		{#if type === 'textarea'}
			<textarea
				placeholder={props.placeholder}
				bind:value
				oninput={() => deleteError && deleteError()}
				class:ltr:pl-10={!!Icon}
				class:rtl:pr-11={!!Icon}
				class="min-h-60 {className} {props.inputClass}"
				{disabled}
				{id}
			></textarea>
		{:else}
			<input
				type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
				placeholder={props.placeholder}
				bind:value
				oninput={() => deleteError && deleteError()}
				class:ltr:pl-10={!!Icon}
				class:rtl:pr-11={!!Icon}
				class:ltr:pr-11={type === 'password'}
				class:rtl:pl-1={type === 'password'}
				class="{className} {props.inputClass}"
				{disabled}
				{id}
			/>
		{/if}
	</div>

	<!--* Password Eye Icon *-->
	{#if type === 'password'}
		<button
			onclick={() => (showPassword = !showPassword)}
			aria-label="password eye"
			class="absolute top-1/2 size-5 -translate-y-1/2 ltr:right-3 rtl:left-3"
		>
			{#if showPassword}
				<svg class="stroke-slightly-muted-foreground size-4" viewBox="0 0 24 24">
					<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
						<path
							d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242"
						/>
						<path
							d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"
						/>
					</g>
				</svg>
			{:else if !showPassword}
				<svg class="stroke-slightly-muted-foreground size-4" viewBox="0 0 24 24">
					<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
						<path
							d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"
						/>
						<circle cx="12" cy="12" r="3" />
					</g>
				</svg>
			{/if}
		</button>
	{/if}

	{#if !!props.hint && type !== 'textarea'}
		<p class="pt-2 text-sm text-gray-400 {props.hintClass}">{props.hint}</p>
	{/if}

	<Errors bind:deleteError bind:errors {name} />
</div>
