import { AxiosError } from 'axios';
import axios from './axios';
import { error } from '@sveltejs/kit';
import type { ObjectType } from '@t/general';
import global from '@stores/global';

const SimpleAxiosGetRequest = async <T extends ObjectType>(
	address: string,
	c: new (obj: ObjectType) => T
) => {
	return axios
		.get<T[]>(address)
		.then((res) => res.data.map((v) => new c(v)))
		.catch((res: AxiosError) => {
			global.error.set(res);
			global.errorTime.set(new Date());
			error(res.status ? res.status : 503);
		});
};

export default SimpleAxiosGetRequest;
