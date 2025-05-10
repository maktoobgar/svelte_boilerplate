import { writable, type Writable } from 'svelte/store';
import { setLocale } from '@i18n/i18n-svelte';
import { loadAllLocales } from '@/i18n/i18n-util.sync';
import { i18n as i18nInit } from '@/i18n/i18n-util';
import { languageKey } from '@/consts/keys';

const langTypeList = ['fa', 'en'] as const;
export type LanguageType = (typeof langTypeList)[number];
export const isLanguage = (x: any): x is LanguageType => langTypeList.includes(x);

const langInit =
	typeof localStorage !== 'undefined' && isLanguage(localStorage.getItem(languageKey))
		? (localStorage.getItem(languageKey) as LanguageType)
		: 'en';

const dirTypeList = ['ltr', 'rtl'] as const;
export type Dir = (typeof dirTypeList)[number];
const dirInit = langInit === 'fa' ? 'rtl' : 'ltr';

export type i18n = {
	language: Writable<LanguageType>;
	dir: Writable<Dir>;
};

export let languageWritable = writable<LanguageType>(langInit);
export let dirWritable = writable<Dir>(dirInit);

// Load all locals
loadAllLocales();
i18nInit();
setLocale(langInit);

let firstRun = true;
const setLanguage = (value: LanguageType) => {
	if (typeof document === 'undefined') return;

	switch (value) {
		case 'en':
			document.documentElement.classList.add('font-vazir-latin');
			document.documentElement.classList.remove('font-vazir');
			document.dir = 'ltr';
			break;
		case 'fa':
			document.documentElement.classList.remove('font-vazir-latin');
			document.documentElement.classList.add('font-vazir');
			document.dir = 'rtl';
			break;
	}

	// * I don't want to set language and dir again at the first run
	if (firstRun) {
		firstRun = false;
		return;
	}

	setLocale(value);
	localStorage.setItem(languageKey, value);
	dirWritable.set(document.dir as Dir);
	languageWritable.set(value);
};

setLanguage(langInit);

export default {
	language: {
		...languageWritable,
		set: setLanguage
	},
	dir: dirWritable
};
