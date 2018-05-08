// @flow
import request from '../request';

export default async function domains(): Promise<Zeit$Domains> {
	const result: Zeit$Domains = await request('/domains', 'GET');

	return result;
}
