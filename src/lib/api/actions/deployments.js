// @flow
import qs from 'query-string';
import request from '../request';
import { caught } from '../../utils';

export async function deployments(): Promise<Zeit$Deployments> {
	const result: Zeit$Deployments = await request('/v2/now/deployments', 'GET');

	return result;
}

export async function deploymentDetails(id: string, type: string): Promise<Zeit$DeploymentDetails> {
	const query = qs.stringify({ types: 'event' });
	const [deployment, scale, events, aliases] = await Promise.all([
		caught(request(`/v3/now/deployments/${id}`, 'GET')),
		caught(request(`/v3/now/deployments/${id}/instances`, 'GET')),
		type === 'STATIC'
			? null
			: caught(request(`/v1/now/deployments/${id}/events`, 'GET', { query })),
		caught(request(`/v2/now/deployments/${id}/aliases`, 'GET')),
	]);

	return {
		deployment,
		scale,
		events,
		aliases,
	};
}
