import { uidGenerator } from '@utils/general';

export default class OptionItem {
	id: string;
	title: string;
	disabled: boolean;
	value: any;

	constructor(
		title: string,
		value: any = null,
		options: { id?: string; disabled?: boolean } = { id: '', disabled: false }
	) {
		this.id = uidGenerator();
		this.id = !!options.id ? options.id : this.id;

		this.title = title;
		this.value = value;
		this.disabled = options.disabled || false;
	}
}
