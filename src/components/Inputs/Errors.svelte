<script lang="ts" module>
	import { slide } from 'svelte/transition';
	import easeOut from '@anims/easings';
	import { type ErrorType } from '@t/responses/error_response';

	interface Props {
		name: string;
		errors: ErrorType;
		deleteError: () => void;
	}
</script>

<script lang="ts">
	let { name, errors = $bindable({}), deleteError = $bindable() }: Props = $props();

	deleteError = () => {
		if (errors && typeof errors === 'object' && name in errors) {
			delete errors[name];
			errors = { ...errors };
		}
	};
</script>

{#if errors && typeof errors !== 'string' && name in errors}
	<div class="spaec-y-1 flex flex-col pt-1">
		{#each errors[name] as error, index (index)}
			<p
				transition:slide|global={{ easing: easeOut, duration: 200, delay: index * 100 }}
				class="text-sm text-red-500"
			>
				{error}
			</p>
		{/each}
	</div>
{/if}
