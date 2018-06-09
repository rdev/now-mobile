// @flow
import request from '../request';

export default async function deployments(): Promise<Zeit$Deployments> {
	const result: Zeit$Deployments = await request('/v2/now/deployments', 'GET');

	return result;
}
