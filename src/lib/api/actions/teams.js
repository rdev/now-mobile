// @flow
import request from '../request';

export async function getTeams(): Promise<Zeit$Teams> {
	const result: Zeit$Teams = await request('/teams', 'GET');

	return result;
}

export async function getTeam(id: string): Promise<Zeit$Team> {
	const result: Zeit$Team = await request(`/teams/${id}`, 'GET');

	return result;
}

// @TODO
export async function createTeam(slug: string): Promise<*> {
	const result: Zeit$NewTeam = await request('/teams', 'POST', {
		body: { slug },
	});

	return result;
}

export async function changeTeamName(id: string, name: string) {
	const result = await request(`/teams/${id}`, 'PATCH', {
		body: { name },
	});

	return result;
}
