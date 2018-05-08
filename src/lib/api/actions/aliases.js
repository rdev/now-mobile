// @flow
import request from '../request';

export default async function aliases(): Promise<Zeit$Aliases> {
	const result: Zeit$Aliases = await request('/v2/now/aliases', 'GET');

	return result;
}
