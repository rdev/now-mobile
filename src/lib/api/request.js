// @flow
import { AsyncStorage } from 'react-native';

export default async function request(
	path: string,
	method: Method,
	options?: RequestOptions,
): Promise<*> {
	try {
		const TOKEN = await AsyncStorage.getItem('@now:token');
		const url =
			options && options.endpoint
				? `https://${options.endpoint}${path}`
				: `https://api.zeit.co${path}${options && options.team ? `?teamId=${options.team}` : ''}`;

		const res = await fetch(url, {
			headers: {
				Authorization: TOKEN ? `Bearer ${TOKEN}` : null,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: options ? JSON.stringify(options.body) : null,
			method,
		});

		return res.json();
	} catch (e) {
		// @TODO: NICE ERROR ALERTING
		console.log(e);
		return Promise.reject(e);
	}
}

