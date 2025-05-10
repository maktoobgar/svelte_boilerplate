import Toast from '@cp/Toaster/Toast.svelte';
import { mount, unmount } from 'svelte';
import { writable } from 'svelte/store';
import ll from '@i18n/i18n-svelte';
import type { TranslationFunctions } from '@i18n/i18n-types';

let LL: TranslationFunctions;
ll.subscribe((v) => (LL = v));

type ToastType = 'success' | 'info' | 'warning' | 'error';

export function toast(title: string, text: string, type: ToastType, duration: number) {
	const container = document.getElementById('toaster');
	if (!container) {
		console.warn('Toaster container not found. Did you forget to include <ToasterInit>?');
		return;
	}

	let component_remover = writable(() => {});
	let toast = mount(Toast, {
		target: container,
		props: { title, text, type, duration, component_remover: component_remover }
	});
	component_remover.set(() => unmount(toast, { outro: true }));
}

export function success(text: string, title: string = '', duration: number = 5000) {
	if (title === '') title = LL.ServerErrorTitles.Success();
	toast(title, text, 'success', duration);
}

export function info(text: string, title: string = '', duration: number = 5000) {
	if (title === '') title = LL.ServerErrorTitles.Info();
	toast(title, text, 'info', duration);
}

export function warning(text: string, title: string = '', duration: number = 5000) {
	if (title === '') title = LL.ServerErrorTitles.Warning();
	toast(title, text, 'warning', duration);
}

export function error(text: string, title: string = '', duration: number = 5000) {
	if (title === '') title = LL.ServerErrorTitles.Error();
	toast(title, text, 'error', duration);
}
