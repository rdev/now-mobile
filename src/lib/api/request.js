// @flow
import { AsyncStorage, Platform } from 'react-native';
import pkg from '../../../package.json';

export default async function request(
	path: string,
	method: Method,
	options?: RequestOptions = {},
): Promise<*> {
	try {
		const TOKEN = await AsyncStorage.getItem('@now:token');
		const TEAM_ID = await AsyncStorage.getItem('@now:teamId');
		const { endpoint = 'api.zeit.co', query } = options;

		const queryString = query
			? `${query}${TEAM_ID ? `&teamId=${TEAM_ID}` : ''}`
			: TEAM_ID
				? `teamId=${TEAM_ID}`
				: '';

		const url = `https://${endpoint}${path}?${queryString}`;
		console.log('REQUEST', path);

		const res = await fetch(url, {
			headers: {
				Authorization: TOKEN ? `Bearer ${TOKEN}` : null,
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': `now-mobile/${pkg.version}/${Platform.OS}`,
			},
			body: options ? JSON.stringify(options.body) : null,
			method,
		});

		console.log('REQUEST DONE', path);

		return res.json();
	} catch (e) {
		console.log(e);
		return Promise.reject(e);
	}
}
