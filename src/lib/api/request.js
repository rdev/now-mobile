// @flow
import { AsyncStorage } from 'react-native';

export default async function request(path: string, method: Method, options?: RequestOptions) {
	try {
		const TOKEN = await AsyncStorage.getItem('@now:token');
		const res = await fetch(`https://api.zeit.co${path}${options && options.team ? `?teamId=${options.team}` : ''}`, {
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
		return console.log(e);
	}
}

