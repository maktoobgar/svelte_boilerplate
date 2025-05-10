import { writable, type Writable } from 'svelte/store';

type GlobalInterface = {
	width: Writable<number>;
	height: Writable<number>;
};

let global: GlobalInterface = {
	width: writable(0),
	height: writable(0)
};

export default global;
