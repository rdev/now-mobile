// @flow
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import moment from 'moment';

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

	console.log('SHARED GROUP DATA', data);

	try {
		await SharedGroupPreferences.setItem('deployments', { data }, appGroupIdentifier);
	} catch (e) {
		console.log('SHARED GROUP ERROR', e);
	}
}

export async function getDeployments() {
	return SharedGroupPreferences.getItem('deployments', appGroupIdentifier);
}
