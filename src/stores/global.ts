import type { AxiosError } from 'axios';
import { writable, type Writable } from 'svelte/store';

type GlobalInterface = {
	width: Writable<number>;
	height: Writable<number>;
	error: Writable<AxiosError | null>;
	errorTime: Writable<Date | null>;
};

let global: GlobalInterface = {
	width: writable(0),
	height: writable(0),
	error: writable(null),
	errorTime: writable(null)
};

export default global;
