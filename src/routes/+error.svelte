<script lang="ts" module>
	import { page } from '$app/state';
	import global from '@stores/global';
	import { getTimeAgoString } from '@utils/general';
</script>

<script lang="ts">
	const error = global.error;
	const errorTime = global.errorTime;

	if ($errorTime === null) errorTime.set(new Date());

	let differentialText = $state(getTimeAgoString($errorTime!));

	setInterval(() => (differentialText = getTimeAgoString($errorTime!)), 1000);
</script>

<div class="flex flex-col items-center justify-center">
	<h1 class="text-3xl">{page.status}</h1>
</div>
