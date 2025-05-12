import { uidGenerator } from '@utils/general';

export default class OptionItem {
	item_id: () => string | number;
	item_title: () => string;
	item_disabled: () => boolean;

	constructor(
		title: string,
		options: { id?: string; disabled?: boolean } = { id: '', disabled: false }
	) {
		const id = uidGenerator();

		this.item_id = () => (!!options.id ? options.id : id);
		this.item_title = () => title;
		this.item_disabled = () => options.disabled || false;
	}

	public toString(): string {
		return this.item_title ? this.item_title() : 'string representor is not defined';
	}
}
