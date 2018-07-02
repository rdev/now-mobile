// @flow
import request from '../request';

export async function getTeams(): Promise<Zeit$Teams> {
	const result: Zeit$Teams = await request('/teams', 'GET');

	return result;
}

// @TODO
export async function createTeam(): Promise<*> {
	const result: Zeit$Aliases = await request('/teams', 'POST', {
		body: {},
	});

	return result;
}
