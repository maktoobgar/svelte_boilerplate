<script module lang="ts">
	import type ClassProps from '@t/props/class';

	interface Props extends ClassProps {}
</script>

<script lang="ts">
	const { ...props }: Props = $props();
</script>

<svg width="100" height="100" class={props.class} viewBox="0 0 100 100">
	<path
		id="svg_8"
		d="m97,50.6l-14,-29.2c-0.9,-1.8 -2.7,-2.9 -4.6,-2.9l-56.8,0c-2,0 -3.8,1.1 -4.6,2.9l-14,29.2c-0.3,0.7 -0.5,1.5 -0.5,2.2l0,23.5c0,2.8 2.3,5.1 5.1,5.1l84.7,0c2.8,0 5.1,-2.3 5.1,-5.1l0,-23.5c0.1,-0.7 -0.1,-1.5 -0.4,-2.2zm-33.9,-3.4c-1.9,0 -3.7,1.2 -4.3,3c-1.2,3.7 -4.7,6.4 -8.9,6.4s-7.6,-2.7 -8.9,-6.4c-0.6,-1.8 -2.4,-3 -4.3,-3c-6.9,0 -20.8,0 -20.8,0l8.8,-18.4l50.3,0l8.8,18.4c0.1,-0.1 -13.8,-0.1 -20.7,0z"
	/>
</svg>
