import type { LanguageType } from '@stores/i18n';
import type { ColorType, ObjectType } from '@t/general';
import type OptionItem from '@t/inputs/option_item';
import { writable } from 'svelte/store';

export const oneTime = (run: Function | null) => {
	let runAllowedWritable = writable(true);
	let runAllowed = true;
	runAllowedWritable.subscribe((v) => (runAllowed = v));

	const _run = () => {
		if (runAllowed) {
			runAllowedWritable.set(false);
			run && run();
		}
	};

	return { runAllowed: runAllowedWritable, run: _run };
};

// `every` unit is millisecond
export const rateClickLimiter = (every: number) => {
	let clickAllowedWritable = writable(true);
	let clickAllowed = true;
	clickAllowedWritable.subscribe((v) => (clickAllowed = v));

	const click = (runIfAllowed: Function) => {
		if (clickAllowed) {
			clickAllowedWritable.set(false);
			runIfAllowed();
			setTimeout(() => clickAllowedWritable.set(true), every);
			return true;
		}
		return false;
	};

	return { click, clickAllowed: clickAllowedWritable };
};

export function clickOutside(clickOutsideFunc: () => void) {
	const event = (node: HTMLElement | null) => {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				let n: HTMLElement | null = event.target as HTMLElement;
				let ignore = false;
				while (n !== null) {
					if (
						n.hasAttribute('data-ignore-click-outside') &&
						n.getAttribute('data-ignore-click-outside') === node.id
					) {
						ignore = true;
						break;
					}
					n = n.parentElement;
				}
				if (ignore) return;
				node.dispatchEvent(new CustomEvent('clickOutside', { detail: node }));
			}
		};

		document.addEventListener('click', handleClick, true);
		node && node.addEventListener('clickOutside', clickOutsideFunc);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	};

	return event;
}

export function none(node: HTMLElement | null) {
	return { destroy() {} };
}

export function DateFormatter(date: any, language: LanguageType) {
	let options: Intl.DateTimeFormatOptions;
	let locals: string;
	if (language === 'fa') {
		options = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			calendar: 'persian'
		};
		locals = 'fa-IR';
	} else {
		options = {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		};
		locals = 'en-GB';
	}
	return new Intl.DateTimeFormat(locals, options).format(date);
}

export function uidGenerator() {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

export function objToObjCopy(target: ObjectType, source: ObjectType) {
	Object.keys(target).forEach((key: string) => {
		if (key in source) target[key] = source[key];
	});
}

export const renderOnSecondRender = () => {
	let renderWritable = writable(false);
	setTimeout(() => renderWritable.set(true), 0);

	return { renderAllowed: renderWritable };
};

export function getTimeAgoString(previousDate: Date): string {
	const diff = Date.now() - previousDate.getTime();
	const seconds = Math.floor(diff / 1000);

	if (seconds < 60) {
		return `${seconds} ثانیه پیش`;
	} else if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} دقیقه پیش`;
	} else if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		return `${hours} ساعت پیش`;
	} else if (seconds < 2592000) {
		const days = Math.floor(seconds / 86400);
		return `${days} روز پیش`;
	} else if (seconds < 31104000) {
		const months = Math.floor(seconds / 2592000);
		return `${months} ماه پیش`;
	} else {
		const years = Math.floor(seconds / 31104000);
		return `${years} سال پیش`;
	}
}

function removeLeadingZeros(input: string): string {
	let startIndex = 0;

	while (startIndex < input.length && input[startIndex] === '0') {
		startIndex++;
	}

	return input.substring(startIndex);
}

export function formatMoney(amount: number) {
	const suffixes = ['', 'هزار', 'میلیون', 'میلیارد', 'بیلیارد'];
	const parts = String(amount).split(/(?=(?:...)*$)/);

	const formattedAmount = `${parts
		.reverse()
		.map((part, i) => {
			if (part !== '000') {
				part = removeLeadingZeros(part);
				return `${part}${suffixes[i] ? ' ' + suffixes[i] : ''}`;
			}
			return '';
		})
		.filter(Boolean)
		.reverse()
		.join(' و ')}`;

	return formattedAmount ? formattedAmount + ' تومان' : '';
}

export const numFaToLatin = <T extends string | number>(persianNumeralString: T): T => {
	if (typeof persianNumeralString === 'number') return persianNumeralString;
	const persianNumerals = '۰۱۲۳۴۵۶۷۸۹';
	let englishNumeralString = ''; // initialize an empty string to hold the converted numerals

	if (persianNumeralString) {
		for (let i = 0; i < persianNumeralString.length; i++) {
			const currentChar = persianNumeralString.charAt(i); // get the current character from the input string

			if (persianNumerals.includes(currentChar)) {
				// check if the current character is a Persian numeral
				const englishNumeral = persianNumerals.indexOf(currentChar).toString(); // convert the Persian numeral to its corresponding English numeral
				englishNumeralString += englishNumeral; // add the converted numeral to the output string
			} else {
				englishNumeralString += currentChar; // if the current character is not a Persian numeral, add it to the output string as-is
			}
		}
	}

	return englishNumeralString as T;
};

export const numberWithCommas = (x: number): string => {
	return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
};

export const checkKeysExist = (obj: any, keys: string[]) => {
	return obj ? keys.some((key) => obj.hasOwnProperty(key)) : false;
};

export const convertToOptionItem = <T extends OptionItem>(v: T) => {
	const item = v as any;
	return item as OptionItem;
};

export const convertToT = <T extends OptionItem>(v: OptionItem) => {
	return v as unknown as T;
};

export const getTextStyles = () => {
	return 'text-white';
};

export function preventDefault(fn: (e: Event) => void) {
	return function (event: Event) {
		event.preventDefault();
		fn(event);
	};
}

export function stopPropagation(fn: (e: Event) => void) {
	return function (event: Event) {
		event.stopPropagation();
		fn(event);
	};
}

export const getColorTheme = (color: ColorType, withTextStyles = false) => {
	const disabledClasses = ' disabled:bg-muted-foreground';
	const classes = disabledClasses + (withTextStyles ? ` ${getTextStyles()}` : '');

	switch (color) {
		case 'primary':
			return 'bg-primary-500 hover:bg-primary-600 dark:bg-primary-700' + classes;
		case 'secondary':
			return 'bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-700' + classes;
		case 'blue':
			return 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700' + classes;
		case 'brown':
			return 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700' + classes;
		case 'cyan':
			return 'bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-700' + classes;
		case 'green':
			return 'bg-green-500 hover:bg-green-600 dark:bg-green-700' + classes;
		case 'orange':
			return 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-700' + classes;
		case 'pink':
			return 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-700' + classes;
		case 'purple':
			return 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-700' + classes;
		case 'red':
			return 'bg-red-500 hover:bg-red-600 dark:bg-red-700' + classes;
		case 'yellow':
			return 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700' + classes;
		default:
			return classes;
	}
};
