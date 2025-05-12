<script lang="ts" module>
	import '../app.css';
	import '@stores/theme';
	import '@stores/i18n';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import ToasterInit from '@cp/Toaster/ToasterInit.svelte';
	import GlobalInit from '@cp/GlobalInit/GlobalInit.svelte';
	import ThemeSwitcher from '@cp/Theme/ThemeSwitcher.svelte';
	import DarkModeSwitcher from '@cp/Theme/DarkModeSwitcher.svelte';
	import LanguageChanger from '@cp/I18n/LanguageChanger.svelte';
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
<ThemeSwitcher class="fixed right-0 bottom-0 z-[1000]" />
<DarkModeSwitcher class="fixed right-16 bottom-0 z-[1000]" />
<LanguageChanger class="fixed right-32 bottom-0 z-[1000]" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
