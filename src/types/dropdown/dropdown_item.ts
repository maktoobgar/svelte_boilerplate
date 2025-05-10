import type { Component } from 'svelte';

export default interface DropdownItem {
	id: string;
	text: string;
	href?: string;
	icon?: Component;
	click?: () => void;
	lineBelow?: boolean;
}
