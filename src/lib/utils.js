import { Dimensions } from 'react-native';

export function validEmail(email) {
	const EMAIL_RX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	return email && EMAIL_RX.test(email);
}

export const viewport = Dimensions.get('screen');
