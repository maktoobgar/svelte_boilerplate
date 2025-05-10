<script lang="ts" module>
	import global from '@stores/global';
</script>

<script lang="ts">
	// * Why I did this madness? Just read the comment down below
	const w = global.width;
	const h = global.height;

	$effect(() => {
		if ($w !== width) w.set(width);
		if ($h !== height) h.set(height);
	});

	let width = $state(0);
	let height = $state(0);
</script>

<svelte:window bind:outerWidth={width} bind:outerHeight={height} />

<!-- * For some reason, this returns an error and doesn't work * -->
<!-- <svelte:window bind:outerWidth={global.width} bind:outerHeight={global.height} /> -->
