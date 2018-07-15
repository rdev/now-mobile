// @flow
import request from '../request';

export async function getTeams(): Promise<Zeit$Teams> {
	const result: Zeit$Teams = await request('/teams', 'GET');

	return result;
}

// @TODO
export async function createTeam(slug: string): Promise<*> {
	const result: Zeit$NewTeam = await request('/teams', 'POST', {
		body: { slug },
	});

	return result;
}
