// @flow
import { Dimensions, Platform } from 'react-native';

type PlansMap = Map<string, Plan>;

/**
 * Email validation
 *
 * @export
 * @param {*} email - Email to validate
 * @returns {boolean}
 */
export function validEmail(email: string): boolean {
	const EMAIL_RX = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	return email ? EMAIL_RX.test(email) : false;
}

export const viewport = Dimensions.get('screen');

/**
 * Format bytes to a readable format
 *
 * @export
 * @param {*} bytes - Bytes to convert
 * @param {*} decimals - Decimals
 * @returns {string}
 */
export function formatBytes(bytes: number, dm?: number = 2): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	// Exponentiation operator doesn't work on Android for some reason (https://github.com/facebook/react-native/issues/8290#issuecomment-315491051)
	/* eslint-diable-next-line no-restricted-properties */
	return `${Math.floor(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)))} ${sizes[i]}`;
}

const mb = 1048576;
const gb = 1024 * mb;

export const plans: PlansMap = new Map([
	[
		'oss',
		{
			bandwidth: gb,
			logs: 100 * mb,
			concurrentInstances: 3,
			domains: 0,
		},
	],
	[
		'free',
		{
			bandwidth: gb,
			logs: 100 * mb,
			concurrentInstances: 3,
			domains: 0,
		},
	],
	[
		'premium',
		{
			bandwidth: 50 * gb,
			logs: 1 * gb,
			concurrentInstances: 10,
			domains: 5,
		},
	],
	[
		'pro',
		{
			bandwidth: 200 * gb,
			logs: 3 * gb,
			concurrentInstances: 25,
			domains: 10,
		},
	],
	[
		'advanced',
		{
			bandwidth: 500 * gb,
			logs: 10 * gb,
			concurrentInstances: 50,
			domains: 20,
		},
	],
	[
		'on-demand',
		{
			bandwidth: Infinity,
			logs: Infinity,
			concurrentInstances: Infinity,
			domains: Infinity,
		},
	],
	[
		'unlimited',
		{
			bandwidth: Infinity,
			logs: Infinity,
			concurrentInstances: Infinity,
			domains: Infinity,
		},
	],
]);

export function isIphoneX(): boolean {
	const dimen = Dimensions.get('window');

	return (
		Platform.OS === 'ios' &&
		!Platform.isPad &&
		!Platform.isTVOS &&
		(dimen.height === 812 || dimen.width === 812)
	);
}

export function isIphoneSE(): boolean {
	const dimen = Dimensions.get('window');

	return (
		Platform.OS === 'ios' &&
		!Platform.isPad &&
		!Platform.isTVOS &&
		(dimen.height === 568 || dimen.width === 568)
	);
}
