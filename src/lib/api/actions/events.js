// @flow
import request from '../request';

export default async function events(query: string): Promise<Zeit$Events> {
	const result: Zeit$Events = await request('/events', 'GET', { query });
	return result;
}
