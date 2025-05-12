import type { ObjectType } from '@t/general';
import OptionItem from '@t/inputs/option_item';
import { objToObjCopy } from '@utils/general';

export default class Model extends OptionItem {
	is_active!: boolean;
	updated_at!: Date;
	created_at!: Date;

	constructor(obj: ObjectType, title: string, disabled: boolean) {
		super(title, { id: 'id' in obj ? obj.id : undefined, disabled: disabled });
		objToObjCopy(this, obj);

		if ('created_at' in obj) this.created_at = new Date(obj.created_at);
		if ('updated_at' in obj) this.updated_at = new Date(obj.updated_at);
	}
}
