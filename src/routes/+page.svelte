<script lang="ts" module>
	import Chart from '@cp/Charts/Chart.svelte';
	import DatePicker from '@cp/DatePicker/DatePicker.svelte';
	import DropdownMenu from '@cp/Dropdown/DropdownMenu.svelte';
	import LanguageChanger from '@cp/I18n/LanguageChanger.svelte';
	import Button from '@cp/Inputs/Button.svelte';
	import Checkbox from '@cp/Inputs/Checkbox.svelte';
	import Input from '@cp/Inputs/Input.svelte';
	import MultiSelect from '@cp/Inputs/MultiSelect.svelte';
	import RadioGroup from '@cp/Inputs/RadioGroup.svelte';
	import Select from '@cp/Inputs/Select.svelte';
	import Modal from '@cp/Modals/Modal.svelte';
	import DarkModeSwitcher from '@cp/Theme/DarkModeSwitcher.svelte';
	import ThemeSwitcher from '@cp/Theme/ThemeSwitcher.svelte';
	import Tooltip from '@cp/Tooltip/Tooltip.svelte';
	import Profile from '@icons/Profile.svelte';
	import { dirWritable as dir } from '@stores/i18n';
	import OptionItem from '@t/inputs/option_item';
	import { success } from '@utils/toast';
	import type { ApexOptions } from 'apexcharts';
</script>

<script lang="ts">
	let value = $state('');
	let options: OptionItem[] = [
		new OptionItem('زندگی خوب'),
		new OptionItem('متوسط با بالا و بلندی'),
		new OptionItem('سقوط...', null, { disabled: true })
	];
	let openDatePicker = $state(false);
	let openDropdownMenu = $state(false);

	let newData = [10, 60, 85, 101, 50, 30, 150, 100, 250];
	let series: ApexOptions['series'] = $state([
		{
			name: 'works',
			type: 'area',
			data: [33, 48, 20, 35, 20, 50, 68, 100, 130]
		},
		{
			name: 'sales',
			type: 'bar',
			data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
		}
		// {
		// 	name: 'sales',
		// 	type: 'candlestick',
		// 	data: [
		// 		[33, [6593.34, 6600, 6582.63, 6600]],
		// 		[1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
		// 	]
		// }
	]);
</script>

<div class="overflow-y-hidden px-8">
	<Input
		bind:value
		type="text"
		placeholder="just a simple text"
		icon={Profile}
		class="my-3"
		label="Username:"
		hint="Just do it man, it is not that hard."
		name="k"
		errors={{ k: ['The error is here', 'Error 2'] }}
	/>

	<Chart
		class="w-[500px]"
		chartOptions={{
			type: 'line'
		}}
		xaxis={{
			categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
		}}
		{series}
	/>

	<Button
		onclick={() => {
			series.push({
				name: 'jobs',
				data: newData
			});
		}}
	></Button>

	<DropdownMenu
		id="0"
		bind:open={openDropdownMenu}
		transition="scale"
		class="pb-3"
		profile={{
			name: 'Testing it',
			description: 'Let me say I am kinda getting it',
			href: '#',
			imgSrc: 'https://i.pinimg.com/originals/25/bd/8b/25bd8b7f6e57cdfd17747b25d753b2ce.jpg'
		}}
		items={[
			{ id: '0', text: 'View Profile', href: '#', icon: Profile },
			{ id: '1', text: 'Settings', href: '#', lineBelow: true, icon: Profile },
			{ id: '2', text: 'Team', href: '#', icon: Profile },
			{ id: '3', text: 'Invite Colleagues', href: '#', icon: Profile },
			{ id: '4', text: 'Help', href: '#', lineBelow: true, icon: Profile },
			{ id: '5', text: 'Sign out', href: '#', icon: Profile }
		]}
	>
		<Button
			onclick={() => (openDropdownMenu = !openDropdownMenu)}
			class="group bg-gray-200 shadow-lg"
			color="green"
		>
			<span class="mx-1">My name</span>
			<svg
				data-open={openDropdownMenu}
				class="mx-1 h-5 w-5 data-[open=true]:rotate-180"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
					fill="currentColor"
				/>
			</svg>
		</Button>
	</DropdownMenu>

	<Tooltip
		text="Click to change dark/light mode"
		xDirection={$dir === 'ltr' ? 'right' : 'left'}
		yDirection="center"
	>
		<DarkModeSwitcher />
	</Tooltip>
	<Tooltip
		text="Click to change theme"
		xDirection={$dir === 'ltr' ? 'right' : 'left'}
		yDirection="center"
	>
		<ThemeSwitcher />
	</Tooltip>
	<Tooltip
		text="Click to change language"
		xDirection={$dir === 'ltr' ? 'right' : 'left'}
		yDirection="center"
	>
		<LanguageChanger />
	</Tooltip>

	<RadioGroup
		groupClass="flex flex-col space-y-2"
		{options}
		errors={{ k: ['The error is here', 'Error 2'] }}
		name="k"
	/>
	<Button
		icon={Profile}
		class="mt-4"
		text="Click me"
		color="primary"
		onclick={() => success('hi', "don't be a bitch")}
	/>

	<Select
		icon={Profile}
		placeholder="Write what you think"
		label="Select an option:"
		class="mt-5"
		hint="Let me describe you little bitch, just write what you think."
		options={[new OptionItem('Hi, new option'), new OptionItem('Hi, second option')]}
		name="k"
		errors={{ k: ['The error is here', 'Error 2'] }}
	/>

	<Checkbox class="mt-2" option={new OptionItem('Hi, new option')} />

	<MultiSelect
		icon={Profile}
		placeholder="Write what you think"
		label="Select an option:"
		class="mt-5"
		hint="Let me describe you little bitch, just write what you think."
		options={[new OptionItem('Hi, new option'), new OptionItem('Hi, second option')]}
		name="k"
		errors={{ k: ['The error is here', 'Error 2'] }}
	/>

	<DatePicker class="min-w-sm" bind:open={openDatePicker}>
		<Button onclick={() => (openDatePicker = !openDatePicker)} text="Open DatePicker"></Button>
	</DatePicker>

	<Select
		icon={Profile}
		placeholder="Write what you think"
		label="Select an option:"
		class="mt-5"
		hint="Let me describe you little bitch, just write what you think."
		options={[
			new OptionItem('Hi, new option'),
			new OptionItem('Hi, second option'),
			new OptionItem('Hi, new option'),
			new OptionItem('Hi, second option'),
			new OptionItem('Hi, new option'),
			new OptionItem('Hi, second option')
		]}
		name="k"
		errors={{ k: ['The error is here', 'Error 2'] }}
	/>
</div>
