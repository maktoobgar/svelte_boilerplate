import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		prerender: {
			entries: ['*']
		},

		adapter: adapter(),

		alias: {
			'@anims': './src/animations',
			'@Layouts': './src/components/Layouts',
			'@stores': './src/stores',
			'@icons': './src/icons',
			'@consts': './src/consts',
			'@utils': './src/utils',
			'@i18n': './src/i18n',
			'@cp': './src/components',
			'@t': './src/types',
			'@': './src'
		}
	},
};

export default config;
