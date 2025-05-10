import type ClassChildrenProps from '@t/props/class_children';

export interface DropdownProps extends ClassChildrenProps {
	id?: string;
	openReverse?: boolean;
	open?: boolean;
	distanceMenu?: string;
	menuClass?: string;
	transition?: 'fly' | 'scale';
}
