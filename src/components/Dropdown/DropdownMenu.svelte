<script lang="ts" module>
	import { uidGenerator } from '@utils/general';
	import { type Component } from 'svelte';
	import Dropdown from './Dropdown.svelte';
	import type { DropdownProps } from './type';
	import type DropdownItem from '@t/dropdown/dropdown_item';

	interface ProfileInterface {
		name: string;
		description: string;
		imgSrc?: string;
		href: string;
	}

	type Profile = ProfileInterface | null;

	interface Props extends DropdownProps {
		profile?: Profile;
		items?: DropdownItem[];
	}
</script>

<script lang="ts">
	let {
		id = uidGenerator(),
		openReverse = false,
		open = $bindable(false),
		items = [],
		distanceMenu = '8',
		transition = 'scale',
		profile = null,
		...props
	}: Props = $props();
</script>

<Dropdown
	{id}
	{openReverse}
	{distanceMenu}
	{transition}
	menuClass={props.menuClass}
	children={props.children}
	class={props.class}
	bind:open
>
	{#snippet content()}
		<div class="sm:w-56">
			{#if profile}
				<a
					href={profile.href}
					class="bg-slightly-muted-background hover:bg-muted-background flex w-full justify-start p-3 text-sm"
				>
					{#if profile.imgSrc}
						<img
							class="mx-1 h-9 w-9 flex-shrink-0 rounded-full object-cover"
							src={profile.imgSrc}
							alt="avatar"
						/>
					{/if}
					<div class="mx-1 overflow-x-hidden">
						<h1 class="text-foreground line-clamp-1 text-sm font-semibold capitalize">
							{profile.name}
						</h1>
						<p class="text-muted-foreground line-clamp-1 text-xs">
							{profile.description}
						</p>
					</div>
				</a>
				<hr class="border-border" />
			{/if}

			{#each items as item (item.id)}
				{@const Icon = item.icon}
				{#snippet insideContent()}
					{#if Icon}
						<div class="mx-1 h-5 w-5">
							<Icon />
						</div>
					{/if}

					<span class="mx-1 line-clamp-1">{item.text}</span>
				{/snippet}

				{#if !!item.href}
					<a
						href={item.href}
						onclick={() => {
							item.click && item.click();
							open = false;
						}}
						class="group bg-slightly-muted-background hover:bg-muted-background flex w-full items-center justify-start overflow-x-hidden p-3 text-sm capitalize"
					>
						{@render insideContent()}
					</a>
				{:else}
					<button
						onclick={() => {
							item.click && item.click();
							open = false;
						}}
						class="group w-full !justify-start !rounded-none bg-gray-200 !p-3 text-sm capitalize hover:bg-gray-100"
					>
						{@render insideContent()}
					</button>
				{/if}

				{#if item.lineBelow}
					<hr class="border-border" />
				{/if}
			{/each}
		</div>
	{/snippet}
</Dropdown>
