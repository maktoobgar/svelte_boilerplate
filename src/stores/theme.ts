import { writable } from 'svelte/store';
import { themeKey, darkModeKey } from '@consts/keys';

export const themeTypeList = ['default', 'sky-trees'] as const;
type Theme = (typeof themeTypeList)[number];
const isTheme = (x: any): x is Theme => themeTypeList.includes(x);

const themeInit =
	typeof localStorage !== 'undefined' && isTheme(localStorage.getItem(themeKey))
		? (localStorage.getItem(themeKey) as Theme)
		: 'default';
const darkModeInit =
	typeof localStorage !== 'undefined' ? localStorage.getItem(darkModeKey) === 'true' : false;

let theme: {
	theme: Theme;
	darkMode: boolean;
} = { theme: themeInit, darkMode: darkModeInit };
const themeWritable = writable(theme);

themeWritable.subscribe((v) => (theme = v));

let firstRun = true;
const setTheme = (theme: Theme, darkMode: boolean) => {
	if (typeof document === 'undefined') return;

	// * Set Theme
	for (let theme of themeTypeList) document.documentElement.classList.remove(theme);
	document.documentElement.classList.add(theme);

	// * Set Dark mode
	darkMode
		? document.documentElement.classList.add('dark')
		: document.documentElement.classList.remove('dark');

	// * I don't want to set theme again at the first run
	if (firstRun) {
		firstRun = false;
		return;
	}

	// * Set dark mode and theme for themeWritable
	localStorage.setItem(themeKey, theme);
	localStorage.setItem(darkModeKey, darkMode.toString());
	themeWritable.set({ theme: theme, darkMode: darkMode });
};

const setNextTheme = () => {
	let themeIndex = themeTypeList.findIndex((v) => v === theme.theme);
	if (themeIndex === -1) {
		setTheme(themeTypeList[0], theme.darkMode);
		return;
	}

	if (themeIndex + 1 < themeTypeList.length)
		setTheme(themeTypeList[themeIndex + 1], theme.darkMode);
	else setTheme(themeTypeList[0], theme.darkMode);
};

setTheme(themeInit, darkModeInit);

export default {
	...themeWritable,
	set: setTheme,
	setNextTheme: setNextTheme
};
