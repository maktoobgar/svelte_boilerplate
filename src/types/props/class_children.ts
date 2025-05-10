import type { Snippet } from 'svelte';
import type ClassProps from './class';

export default interface ClassChildrenProps extends ClassProps {
	children?: Snippet;
}
