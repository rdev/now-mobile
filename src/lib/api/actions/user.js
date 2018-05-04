// @flow
import request from '../request';

export async function vitals(): Promise<Zeit$Vitals> {
	const result = await request('/www/user', 'GET');

	return result;
}

export async function teams() {
	//
}

