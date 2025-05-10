<script lang="ts" module>
	import { languageWritable } from '@stores/i18n';
	import themeWritable from '@stores/theme';
	import type ClassProps from '@t/props/class';
	import { uidGenerator } from '@utils/general';
	import ApexCharts, { type ApexOptions } from 'apexcharts';

	interface Props extends ClassProps {
		id?: string;
		chart?: ApexCharts | null;
		options?: Omit<ApexOptions, 'series' | 'chart' | 'legend' | 'theme' | 'xaxis' | 'yaxis'>;
		series?: ApexOptions['series'];
		chartOptions?: ApexOptions['chart'];
		legend?: ApexOptions['legend'];
		theme?: ApexOptions['theme'];
		xaxis?: ApexOptions['xaxis'];
		yaxis?: ApexOptions['yaxis'];
		redrawPathsOnUpdate?: boolean;
		animateOnUpdate?: boolean;
		updateSyncedChartsOnUpdate?: boolean;
	}
</script>

<script lang="ts">
	let {
		id = uidGenerator(),
		chart = $bindable(null),
		options = {},
		series = [],
		chartOptions = {},
		legend = {},
		theme = {},
		xaxis = {},
		yaxis = {},
		redrawPathsOnUpdate = true,
		animateOnUpdate = true,
		updateSyncedChartsOnUpdate = true,
		...props
	}: Props = $props();

	$effect(() => {
		if (document.getElementById(id) === null) return;

		const calculatedOptions = {
			...options,
			chart: {
				...chartOptions,
				fontFamily: $languageWritable === 'fa' ? 'Vazir, sans-serif' : 'Vazir-Latin, sans-serif',
				background: 'transparent'
			},
			series: series,
			legend: legend,
			theme: { ...theme, mode: $themeWritable.darkMode ? 'dark' : 'light' },
			xaxis: xaxis,
			yaxis: yaxis,
			id: id
		};

		console.log(calculatedOptions);

		if (chart !== null) {
			chart.updateOptions(
				calculatedOptions,
				redrawPathsOnUpdate,
				animateOnUpdate,
				updateSyncedChartsOnUpdate
			);
		} else {
			chart = new ApexCharts(document.getElementById(id), calculatedOptions);

			chart.render();
		}
	});
</script>

<div {id} class="text-black {props.class}"></div>
