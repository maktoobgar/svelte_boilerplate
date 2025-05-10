<script lang="ts" module>
	import '../app.css';
	import '@stores/theme';
	import '@stores/i18n';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import ToasterInit from '@cp/Toaster/ToasterInit.svelte';
	import GlobalInit from '@cp/GlobalInit/GlobalInit.svelte';
</script>

<script lang="ts">
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false // default: true
			}
		}
	});

	let { children } = $props();
</script>

<GlobalInit />
<ToasterInit where="bottom_right" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
