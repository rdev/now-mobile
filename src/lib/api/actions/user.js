// @flow
import request from '../request';

export async function vitals(): Promise<Zeit$Vitals> {
	const result: Zeit$Vitals = await request('/www/user', 'GET');

	return result;
}

export async function teams() {
	//
}

export function avatarPath(id: string) {
	return id ? `https://zeit.co/api/www/avatar/${id}?s=90` : '';
}
