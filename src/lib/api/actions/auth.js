// @flow
import { AsyncStorage } from 'react-native';
import request from '../request';

export async function login(email: string): Promise<Zeit$Preauth> {
	const result = await request('/now/registration', 'POST', {
		body: {
			email,
			tokenName: 'Now Mobile',
		},
	});

	return result;
}

export async function verify(email: string): Promise<Zeit$Auth> {
	const TOKEN = await AsyncStorage.getItem('@now:preauthToken');
	const result = await request(`/now/registration/verify?email=${email}&token=${TOKEN}`, 'GET');

	return result;
}
