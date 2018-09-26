// @flow
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import moment from 'moment';
import { plans, formatBytes } from '../../lib/utils';

const appGroupIdentifier = 'group.im.rdev.now-mobile';

moment.updateLocale('en', {
	relativeTime: {
		s: '%ds',
		ss: '%ds',
		m: '%dm',
		mm: '%dm',
		h: '%dh',
		hh: '%dh',
		d: '%dd',
		dd: '%dd',
	},
});

export async function saveDeployments(deployments: Zeit$Deployment[]) {
	const data = deployments
		.sort((a, b) => new Date(b.created) - new Date(a.created))
		.map((deployment) => {
			const diff = moment().diff(moment(deployment.created), 'days');

			return {
				url: deployment.url,
				date: diff > 1 ? `${diff}d` : moment(deployment.created).fromNow(true),
				instances: deployment.scale ? deployment.scale.current : -1, // Using -1 here instead of null so my life in Swift land is easier
				state: deployment.state,
			};
		})
		.slice(0, 5);

	try {
		await SharedGroupPreferences.setItem('deployments', { data }, appGroupIdentifier);
	} catch (e) {
		console.log('SHARED GROUP ERROR', e);
	}
}

export async function saveUsage(usage: Zeit$Usage) {
	const { metrics } = usage;
	const plan = plans.get(usage.plan);

	// Right half of this ternary should never happen, unless Zeit does something breaking
	const max = plan
		? {
			domains: plan.domains,
			bandwidth: plan.bandwidth,
			logs: plan.logs,
			instances: plan.concurrentInstances,
		  }
		: {
			domains: 0,
			bandwidth: 0,
			logs: 0,
			instances: 0,
		  };

	const data = {
		domains: metrics.domains,
		bandwidth: formatBytes(metrics.bandwidth.tx),
		bandwidthLimit: max.bandwidth === Infinity ? '∞' : formatBytes(max.bandwidth),
		logs: formatBytes(metrics.logs.size),
		logsLimit: max.logs === Infinity ? '∞' : formatBytes(max.logs),
		instances: metrics.activeInstances,
		instancesLimit: max.instances === Infinity ? '∞' : `${max.instances}`,
	};

	try {
		await SharedGroupPreferences.setItem('usage', { data }, appGroupIdentifier);
	} catch (e) {
		console.log('SHARED GROUP ERROR', e);
	}
}

export async function getDeployments() {
	return SharedGroupPreferences.getItem('deployments', appGroupIdentifier);
}

export async function getUsage() {
	return SharedGroupPreferences.getItem('usage', appGroupIdentifier);
}

export async function clearDeployments() {
	return SharedGroupPreferences.setItem('deployments', null, appGroupIdentifier);
}

export async function clearUsage() {
	return SharedGroupPreferences.setItem('usage', null, appGroupIdentifier);
}
