<!-- * Credits to https://github.com/nargeszmn/persian-date-picker-svelte * -->
<script lang="ts" module>
	import {
		getMonthLength,
		getCalendarDays,
		type CalendarDay,
		type CalendarType
	} from '@/utils/date-utils';
	import type ClassChildrenProps from '@t/props/class_children';
	import { newDate, getYear, getMonth, getDate } from 'date-fns-jalali';

	function cloneDate(d: Date) {
		return new Date(d.getTime());
	}

	interface Props extends ClassChildrenProps {
		value?: Date | null;
		calendarType?: 'Jalali' | 'Gregorian';
		min?: Date | null;
		max?: Date | null;
		open?: boolean;
		/** Wait with updating the date until a date is selected */
		browseWithoutSelecting?: boolean;
		onselect?: (value: Date) => void;
	}
</script>

<script lang="ts">
	import Dropdown from '@cp/Dropdown/Dropdown.svelte';

	let {
		value = $bindable(null),
		calendarType = 'Jalali',
		browseWithoutSelecting = false,
		open = $bindable(false),
		...props
	}: Props = $props();

	let calendarConfig = $derived(
		calendarType === 'Jalali'
			? {
					weekdays: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
					months: [
						'فروردین',
						'اردیبهشت',
						'خرداد',
						'تیر',
						'مرداد',
						'شهریور',
						'مهر',
						'آبان',
						'آذر',
						'دی',
						'بهمن',
						'اسفند'
					],
					shortMonths: [
						'فرو',
						'ارد',
						'خرد',
						'تیر',
						'مرد',
						'شهر',
						'مهر',
						'آبا',
						'آذر',
						'دی',
						'بهم',
						'اسف'
					],
					weekStartsOn: 6
				}
			: {
					weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
					months: [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					],
					shortMonths: [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					],
					weekStartsOn: 1
				}
	);

	function setValue(d: Date) {
		if (d.getTime() !== value?.getTime()) {
			browseDate = clamp(d, min, max);
			value = cloneDate(browseDate);
		}
	}

	function setValueDate(d: Date) {
		if (d.getTime() !== value?.getTime()) {
			browseDate = clampDate(d, min, max);
			value = cloneDate(browseDate);
		}
	}

	/** Set the browseDate */
	function browse(d: Date) {
		browseDate = clampDate(d, min, max);
		if (!browseWithoutSelecting && value) {
			setValue(browseDate);
		}
	}

	const todayDate = new Date();

	/** Default Date to use */
	const defaultDate = new Date();

	/** The earliest year the user can select */
	let min = $derived(
		props.min
			? props.min
			: calendarType == 'Gregorian'
				? new Date(defaultDate.getFullYear() - 20, 0, 1)
				: newDate(getYear(defaultDate) - 20, 0, 1)
	);

	/** The latest year the user can select */
	let max = $derived(
		props.max
			? props.max
			: calendarType == 'Gregorian'
				? new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999)
				: newDate(
						getYear(defaultDate) + 1,
						11,
						getMonthLength(getYear(defaultDate) + 1, 11, calendarType),
						23,
						59,
						59,
						999
					)
	);

	function clamp(d: Date, min: Date, max: Date) {
		if (d > max) {
			return cloneDate(max);
		} else if (d < min) {
			return cloneDate(min);
		} else {
			return cloneDate(d);
		}
	}

	function clampDate(d: Date, min: Date, max: Date) {
		const limit = clamp(d, min, max);
		if (limit.getTime() !== d.getTime()) {
			d = new Date(
				limit.getFullYear(),
				limit.getMonth(),
				limit.getDate(),
				d.getHours(),
				d.getMinutes(),
				d.getSeconds(),
				d.getMilliseconds()
			);
			d = clamp(d, min, max);
		}
		return d;
	}

	/** The date shown in the popup when none is selected */
	let browseDate = $derived(value ? cloneDate(value) : cloneDate(clampDate(defaultDate, min, max)));

	let years = $derived(getYears(min, max, calendarType));

	function getYears(min: Date, max: Date, calendarType: CalendarType) {
		let years = [];
		if (calendarType == 'Gregorian') {
			for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
				years.push(i);
			}
		} else {
			for (let i = getYear(min); i <= getYear(max); i++) {
				years.push(i);
			}
		}
		return years;
	}

	let browseYear = $derived(
		calendarType == 'Gregorian' ? browseDate.getFullYear() : getYear(browseDate)
	);

	function setYear(newYear: number) {
		const month = calendarType == 'Gregorian' ? browseDate.getMonth() : getMonth(browseDate);
		const monthMaxDate = getMonthLength(newYear, month, calendarType);
		const currentSelectedDay =
			calendarType == 'Gregorian' ? browseDate.getDate() : getDate(browseDate);
		const newDay = Math.min(currentSelectedDay, monthMaxDate);

		if (calendarType == 'Gregorian') {
			browse(
				new Date(
					newYear,
					browseDate.getMonth(),
					newDay,
					browseDate.getHours(),
					browseDate.getMinutes(),
					browseDate.getSeconds(),
					browseDate.getMilliseconds()
				)
			);
		} else {
			// newYear is in Jalali format
			// Must update the browseDate with the corresponding Gregorian Date
			browse(
				newDate(
					newYear,
					getMonth(browseDate),
					newDay,
					browseDate.getHours(),
					browseDate.getMinutes(),
					browseDate.getSeconds(),
					browseDate.getMilliseconds()
				)
			);
		}
	}

	let browseMonth = $derived(
		calendarType == 'Gregorian' ? browseDate.getMonth() : getMonth(browseDate)
	); // * browseMonth must be in Jalali format

	function setMonth(newMonth: number) {
		let newYear = calendarType == 'Gregorian' ? browseDate.getFullYear() : getYear(browseDate);
		if (newMonth === 12) {
			newMonth = 0;
			newYear++;
		} else if (newMonth === -1) {
			newMonth = 11;
			newYear--;
		}

		const maxDate = getMonthLength(newYear, newMonth, calendarType);
		const currentSelectedDay =
			calendarType == 'Gregorian' ? browseDate.getDate() : getDate(browseDate);
		const newDay = Math.min(currentSelectedDay, maxDate);

		if (calendarType == 'Gregorian') {
			browse(
				new Date(
					newYear,
					newMonth,
					newDay,
					browseDate.getHours(),
					browseDate.getMinutes(),
					browseDate.getSeconds(),
					browseDate.getMilliseconds()
				)
			);
		} else {
			browse(
				newDate(
					newYear,
					newMonth,
					newDay,
					browseDate.getHours(),
					browseDate.getMinutes(),
					browseDate.getSeconds(),
					browseDate.getMilliseconds()
				)
			);
		}
	}

	function monthIsInRange(month: number) {
		if (calendarType == 'Gregorian') {
			return (
				new Date(
					browseYear,
					month,
					getMonthLength(browseYear, month, calendarType),
					23,
					59,
					59,
					999
				) < min || new Date(browseYear, month) > max
			);
		} else {
			return (
				newDate(
					browseYear,
					month,
					getMonthLength(browseYear, month, calendarType),
					23,
					59,
					59,
					999
				) < min || newDate(browseYear, month, 1) > max
			);
		}
	}

	let calendarDays = $derived(
		getCalendarDays(browseDate, calendarConfig.weekStartsOn, calendarType)
	);

	function selectDay(calendarDay: CalendarDay) {
		if (dayIsInRange(calendarDay, min, max)) {
			if (calendarType == 'Gregorian') {
				// browseDate.setFullYear(0)
				// browseDate.setMonth(0)
				// browseDate.setDate(1)
				browseDate.setFullYear(calendarDay.year);
				browseDate.setMonth(calendarDay.month);
				browseDate.setDate(calendarDay.number);
			} else {
				//calendarDay is in Jalali format
				const gregorianDate = newDate(calendarDay.year, calendarDay.month, calendarDay.number);
				// browseDate.setFullYear(0)
				// browseDate.setMonth(0)
				// browseDate.setDate(1)
				browseDate.setFullYear(gregorianDate.getFullYear());
				browseDate.setMonth(gregorianDate.getMonth());
				browseDate.setDate(gregorianDate.getDate());
			}
			setValueDate(browseDate);
			props.onselect && props.onselect(cloneDate(browseDate));
			open = false;
		}
	}

	function dayIsInRange(calendarDay: CalendarDay, min: Date, max: Date) {
		const date =
			calendarType == 'Gregorian'
				? new Date(calendarDay.year, calendarDay.month, calendarDay.number)
				: newDate(calendarDay.year, calendarDay.month, calendarDay.number);

		const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate());
		const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate());
		return date >= minDate && date <= maxDate;
	}

	function isToday(calendarDay: CalendarDay) {
		if (calendarType == 'Gregorian') {
			return (
				calendarDay.year === todayDate.getFullYear() &&
				calendarDay.month === todayDate.getMonth() &&
				calendarDay.number === todayDate.getDate()
			);
		} else {
			return (
				calendarDay.year === getYear(todayDate) &&
				calendarDay.month === getMonth(todayDate) &&
				calendarDay.number === getDate(todayDate)
			);
		}
	}

	function isDaySelected(calendarDay: CalendarDay) {
		if (calendarType == 'Gregorian') {
			return (
				value &&
				calendarDay.year === value.getFullYear() &&
				calendarDay.month === value.getMonth() &&
				calendarDay.number === value.getDate()
			);
		} else {
			return (
				value &&
				calendarDay.year === getYear(value) &&
				calendarDay.month === getMonth(value) &&
				calendarDay.number === getDate(value)
			);
		}
	}

	function shiftKeydown(e: KeyboardEvent) {
		if (e.shiftKey && e.key === 'ArrowUp') {
			calendarType == 'Gregorian'
				? setYear(browseDate.getFullYear() - 1)
				: setYear(getYear(browseDate) - 1);
		} else if (e.shiftKey && e.key === 'ArrowDown') {
			calendarType == 'Gregorian'
				? setYear(browseDate.getFullYear() + 1)
				: setYear(getYear(browseDate) + 1);
		} else if (e.shiftKey && e.key === 'ArrowLeft') {
			calendarType == 'Gregorian'
				? setMonth(browseDate.getMonth() - 1)
				: setMonth(getMonth(browseDate) - 1);
		} else if (e.shiftKey && e.key === 'ArrowRight') {
			calendarType == 'Gregorian'
				? setMonth(browseDate.getMonth() + 1)
				: setMonth(getMonth(browseDate) + 1);
		} else {
			return false;
		}
		e.preventDefault();
		return true;
	}

	function yearKeydown(e: KeyboardEvent) {
		let shift = e.shiftKey || e.altKey;
		if (shift) {
			shiftKeydown(e);
			return;
		} else if (e.key === 'ArrowUp') {
			calendarType == 'Gregorian'
				? setYear(browseDate.getFullYear() - 1)
				: setYear(getYear(browseDate) - 1);
		} else if (e.key === 'ArrowDown') {
			calendarType == 'Gregorian'
				? setYear(browseDate.getFullYear() + 1)
				: setYear(getYear(browseDate) + 1);
		} else if (e.key === 'ArrowLeft') {
			calendarType == 'Gregorian'
				? setMonth(browseDate.getMonth() - 1)
				: setMonth(getMonth(browseDate) - 1);
		} else if (e.key === 'ArrowRight') {
			calendarType == 'Gregorian'
				? setMonth(browseDate.getMonth() + 1)
				: setMonth(getMonth(browseDate) + 1);
		} else {
			shiftKeydown(e);
			return;
		}
		e.preventDefault();
	}

	function monthKeydown(e: KeyboardEvent) {
		let shift = e.shiftKey || e.altKey;
		if (shift) {
			shiftKeydown(e);
			return;
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			calendarType == 'Gregorian'
				? setMonth(browseDate.getMonth() - 1)
				: setMonth(getMonth(browseDate) - 1);
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			calendarType == 'Gregorian'
				? setMonth(browseDate.getMonth() + 1)
				: setMonth(getMonth(browseDate) + 1);
		} else {
			shiftKeydown(e);
			return;
		}
		e.preventDefault();
	}

	function keydown(e: KeyboardEvent) {
		let shift = e.shiftKey || e.altKey;
		if (
			(e.target as HTMLElement)?.tagName === 'SELECT' ||
			(e.target as HTMLElement)?.tagName === 'SPAN'
		) {
			// Ignore date/month <select> & TimePicker <input>
			return;
		}
		if (shift) {
			shiftKeydown(e);
			return;
		} else if (e.key === 'ArrowUp') {
			calendarType == 'Gregorian'
				? browseDate.setDate(browseDate.getDate() - 7)
				: browseDate.setDate(getDate(browseDate) - 7);
			setValueDate(browseDate);
		} else if (e.key === 'ArrowDown') {
			calendarType == 'Gregorian'
				? browseDate.setDate(browseDate.getDate() + 7)
				: browseDate.setDate(getDate(browseDate) + 7);
			setValueDate(browseDate);
		} else if (e.key === 'ArrowLeft') {
			calendarType == 'Gregorian'
				? browseDate.setDate(browseDate.getDate() - 1)
				: browseDate.setDate(getDate(browseDate) - 1);
			setValueDate(browseDate);
		} else if (e.key === 'ArrowRight') {
			calendarType == 'Gregorian'
				? browseDate.setDate(browseDate.getDate() + 1)
				: browseDate.setDate(getDate(browseDate) + 1);
			setValueDate(browseDate);
		} else if (e.key === 'Enter') {
			setValue(browseDate);
			props.onselect && props.onselect(cloneDate(browseDate));
			open = false;
		} else {
			return;
		}
		e.preventDefault();
	}
</script>

<Dropdown bind:open children={props.children}>
	{#snippet content()}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- * Removed classes: "shadow-sm rounded-xl border border-border" -->
		<div
			class="bg-slightly-muted-background inline-block cursor-default p-2 text-sm transition-all {props.class}"
			onkeydown={keydown}
		>
			<div class="outline-none" tabindex="-1">
				<div class="ltr flex items-center justify-between pb-2">
					<!-- * Go Previous Month * -->
					<button
						aria-label="Previous month"
						type="button"
						class="border-border bg-slightly-muted-background hover:bg-muted-background relative flex size-10 items-center justify-center overflow-hidden rounded-full border text-sm font-semibold whitespace-nowrap capitalize transition-[background-color] duration-300 select-none"
						onclick={() =>
							calendarType == 'Gregorian'
								? setMonth(browseDate.getMonth() - 1)
								: setMonth(getMonth(browseDate) + 1)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="text-foreground block size-4 fill-current opacity-75"
						>
							<path
								d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
								transform="rotate(180, 12, 12)"
							/>
						</svg>
					</button>

					<div class="flex space-x-2">
						<div class="relative flex">
							<select
								value={browseMonth}
								onkeydown={monthKeydown}
								oninput={(e) => setMonth(parseInt(e.currentTarget.value))}
								class="bg-slightly-muted-background border-border flex-grow appearance-none rounded-xl border px-2 py-2 text-center transition-all outline-none"
							>
								{#each calendarConfig.months as monthName, i}
									<option disabled={monthIsInRange(i)} value={i}>{monthName} </option>
								{/each}
							</select>
						</div>
						<div class="relative flex">
							<select
								value={browseYear}
								oninput={(e) => setYear(parseInt(e.currentTarget.value))}
								onkeydown={yearKeydown}
								class="bg-slightly-muted-background border-border flex-grow appearance-none rounded-xl border px-2 py-2 text-center transition-all outline-none"
							>
								{#each years as v}
									<option value={v}>{v}</option>
								{/each}
							</select>
						</div>
					</div>

					<!-- * Go Next Month * -->
					<button
						aria-label="Next month"
						type="button"
						class="border-border bg-slightly-muted-background hover:bg-muted-background relative flex size-10 items-center justify-center overflow-hidden rounded-full border text-sm font-semibold whitespace-nowrap capitalize transition-[background-color] duration-300 select-none"
						onclick={() =>
							calendarType == 'Gregorian'
								? setMonth(browseDate.getMonth() + 1)
								: setMonth(getMonth(browseDate) - 1)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="text-foreground block size-4 fill-current opacity-75"
						>
							<path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
						</svg>
					</button>
				</div>

				<div class="flex py-2">
					{#each Array(7) as _, i}
						{#if i + calendarConfig.weekStartsOn < 7}
							<div class="w-[1.875rem] flex-grow text-center">
								{calendarConfig.weekdays[calendarConfig.weekStartsOn + i]}
							</div>
						{:else}
							<div class="w-[1.875rem] flex-grow text-center">
								{calendarConfig.weekdays[calendarConfig.weekStartsOn + i - 7]}
							</div>
						{/if}
					{/each}
				</div>

				{#each Array(6) as _, weekIndex}
					<div class="flex space-y-2 space-x-2">
						{#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay}
							<button
								color=""
								disabled={!dayIsInRange(calendarDay, min, max)}
								class="border-border flex size-10 flex-grow cursor-pointer items-center justify-center rounded-xl border transition-all disabled:bg-transparent disabled:line-through disabled:opacity-20
						{calendarDay.month !== browseMonth ? 'opacity-40' : ''} {isDaySelected(calendarDay)
									? 'bg-primary-200 hover:bg-primary-300 dark:bg-primary-800 dark:hover:bg-primary-700 !border-primary-500 border-2 font-semibold'
									: isToday(calendarDay)
										? 'bg-secondary-200 !border-secondary-500 hover:bg-secondary-300 dark:bg-secondary-800 dark:hover:bg-secondary-700 font-semibold'
										: 'bg-muted-background hover:bg-slightly-muted-background !font-normal'}"
								onclick={() => selectDay(calendarDay)}
							>
								<span>
									{calendarDay.number}
								</span>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</Dropdown>
