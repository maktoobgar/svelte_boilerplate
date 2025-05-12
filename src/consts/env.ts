import { PUBLIC_DEBUG } from '$env/static/public';

export const debug = PUBLIC_DEBUG === 'true' ? true : false;
