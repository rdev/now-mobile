// @flow
import request from '../request';

export default async function usage(): Promise<Zeit$Usage> {
	const result: Zeit$Usage = await request('/pricing/state/usage', 'GET');

	return result;
}
