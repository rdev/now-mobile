// @flow
import request from '../request';

export async function getAll(): Promise<Zeit$Aliases> {
	const result: Zeit$Aliases = await request('/v2/now/aliases', 'GET');

	return result;
}

export async function createAlias(
	deploymentId: string,
	alias: string,
): Promise<CreateAliasResponse> {
	const result: CreateAliasResponse = await request(
		`/v2/now/deployments/${deploymentId}/aliases`,
		'POST',
		{ body: { alias } },
	);

	return result;
}

export async function removeAlias(id: string): Promise<RemoveAliasResponse> {
	const result: RemoveAliasResponse = await request(`/v2/now/aliases/${id}`, 'DELETE');

	return result;
}
