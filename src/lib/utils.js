import { Dimensions } from 'react-native';

export function validEmail(email) {
	const EMAIL_RX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	return email && EMAIL_RX.test(email);
}

export const viewport = Dimensions.get('screen');

export function formatBytes(bytes, decimals) {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const dm = decimals || 2;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Math.floor(parseFloat((bytes / (k ** i)).toFixed(dm)))} ${sizes[i]}`;
}

const mb = 1048576;
const gb = 1024 * mb;

export const plans = new Map([
	['oss', {
		bandwidth: gb,
		logs: 100 * mb,
		concurrentInstances: 3,
		domains: 0,
	}],
	['free', {
		bandwidth: gb,
		logs: 100 * mb,
		concurrentInstances: 3,
		domains: 0,
	}],
	['premium', {
		bandwidth: 50 * gb,
		logs: 1 * gb,
		concurrentInstances: 10,
		domains: 5,
	}],
	['pro', {
		bandwidth: 200 * gb,
		logs: 3 * gb,
		concurrentInstances: 25,
		domains: 10,
	}],
	['advanced', {
		bandwidth: 500 * gb,
		logs: 10 * gb,
		concurrentInstances: 50,
		domains: 20,
	}],
	['on-demand', {
		bandwidth: Infinity,
		logs: Infinity,
		concurrentInstances: Infinity,
		domains: Infinity,
	}],
	['unlimited', {
		bandwidth: Infinity,
		logs: Infinity,
		concurrentInstances: Infinity,
		domains: Infinity,
	}],
]);
