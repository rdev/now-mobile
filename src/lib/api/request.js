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
		const { endpoint = 'api.zeit.co', query } = options;

		const url = `https://${endpoint}${path}?${query ? `${query}` : ''}`;

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

		return res.json();
	} catch (e) {
		console.log(e);
		return Promise.reject(e);
	}
}
