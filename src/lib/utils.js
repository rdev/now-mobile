// @flow
import { Dimensions, Platform, AsyncStorage, Linking, Alert } from 'react-native';

type PlansMap = Map<Zeit$PlanName, Plan>;

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

const { height, width } = Dimensions.get('window');

export function isIphoneX(): boolean {
	return (
		Platform.OS === 'ios' &&
		!Platform.isPad &&
		!Platform.isTVOS &&
		(height === 812 || width === 812)
	);
}

export function isIphoneSE(): boolean {
	return (
		Platform.OS === 'ios' &&
		!Platform.isPad &&
		!Platform.isTVOS &&
		(height === 568 || width === 568)
	);
}

// @TODO There's almost certainly a better way to handle the whole font color situation
export const platformBlackColor = Platform.OS === 'android' ? '#2a2a2a' : 'black';

export const isAndroid = Platform.OS === 'android';
export const isPad = height / width < 1.6 && !isAndroid;

export const getUsageLimits = async (mode: Zeit$PlanName) => {
	// User-set limits for 'on-demand' and 'unlimited'
	if (mode === 'on-demand' || mode === 'unlimited') {
		const instances = (await AsyncStorage.getItem('@now:instanceLimit')) || '0';
		const bandwidth = (await AsyncStorage.getItem('@now:bandwidthLimit')) || '0';
		const logs = (await AsyncStorage.getItem('@now:logsLimit')) || '0';

		return {
			instances: instances === '0' ? Infinity : parseInt(instances, 10),
			bandwidth: bandwidth === '0' ? Infinity : parseInt(bandwidth, 10),
			logs: logs === '0' ? Infinity : parseInt(logs, 10),
		};
	}

	// 80% of the plan otherwise
	const plan = plans.get(mode);

	if (plan) {
		const instances = Math.floor(plan.concurrentInstances * 0.8);
		const bandwidth = Math.floor(plan.bandwidth * 0.8);
		const logs = Math.floor(plan.logs * 0.8);

		return { instances, bandwidth, logs };
	}

	// If ZEIT introduces a new plan we shouldn't break
	return { instances: Infinity, bandwidth: Infinity, logs: Infinity };
};

// Stolen from Now CLI
// makes sure the promise never rejects, exposing the error
// as the resolved value instead
export function caught(p: Promise<any>): Promise<any> {
	return new Promise((resolve) => {
		p.then(resolve).catch(resolve);
	});
}

export function promptOpen(path: string) {
	Alert.alert(
		`Open in ${isAndroid ? 'browser' : 'Safari'}`,
		`Do you want to open ${path} in browser?`,
		[
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Open', onPress: () => Linking.openURL(`https://${path}`) },
		],
		{ cancelable: false },
	);
}
