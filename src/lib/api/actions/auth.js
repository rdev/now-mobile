// @flow
import { AsyncStorage } from 'react-native';
import request from '../request';

export async function login(email: string): Promise<Zeit$Preauth> {
	console.log(email);
	const result: Zeit$Preauth = await request('/now/registration', 'POST', {
		body: {
			email,
			tokenName: 'Now Mobile',
		},
	});

	console.log('LOGIN', result);

	return result;
}

export async function verify(email: string): Promise<Zeit$Auth> {
	const TOKEN = await AsyncStorage.getItem('@now:preauthToken');
	const result: Zeit$Auth = await request(
		`/now/registration/verify?email=${email}&token=${TOKEN}&t=${new Date().getTime()}`,
		'GET',
	);

	console.log(result);

	return result;
}
