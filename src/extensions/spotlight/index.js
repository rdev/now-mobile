// @flow
import SpotlightSearch from 'react-native-search-api';

export async function clear() {
	return SpotlightSearch.deleteAllSpotlightItems();
}

export async function indexDeployments(deployments: Zeit$Deployment[]) {
	SpotlightSearch.indexSpotlightItems(deployments.map(deployment => ({
		title: deployment.url,
		contentDescription: `${
			deployment.scale
				? `${deployment.scale.current} instance${
					deployment.scale.current !== 1 ? 's' : ''
					  } | `
				: ''
		} ${deployment.state}`,
		uniqueIdentifier: deployment.uid,
		domain: 'deployment',
		keywords: ['zeit', 'now', 'deployment', 'deployments', deployment.name],
		thumbnail: {},
	})));
}

export async function handleAppOpen() {
	const spotlightActivity = await SpotlightSearch.getInitialSpotlightItem();
	return spotlightActivity;
}

export function addListener(handler: Function) {
	SpotlightSearch.addOnSpotlightItemOpenEventListener(handler);
}

export function removeListener(handler: Function) {
	SpotlightSearch.removeOnSpotlightItemOpenEventListener(handler);
}
