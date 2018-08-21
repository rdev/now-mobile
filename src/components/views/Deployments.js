// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import { connect } from '../../Provider';
import DeploymentGroup from '../elements/deployments/DeploymentGroup';

type Props = {
	context: Context,
};

type DeploymentData = {
	deployments: Zeit$Deployment[],
	name: string,
	last: boolean,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class Deployments extends Component<Props> {
	renderItem = ({ item }: { item: DeploymentData }) => (
		<DeploymentGroup deployments={item.deployments} name={item.name} last={item.last} />
	);

	render() {
		const { deployments, refreshing, reloadDeployments } = this.props.context;
		deployments.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});

		const sortedDeployments = {};
		deployments.forEach((deployment) => {
			if (!sortedDeployments[deployment.name]) sortedDeployments[deployment.name] = [];
			const group = sortedDeployments[deployment.name];

			group.push(deployment);
			if (group.length > 1) group.sort((a, b) => new Date(b.created) - new Date(a.created));
		});

		const data = Object.keys(sortedDeployments).map((key, i) => ({
			deployments: sortedDeployments[key],
			name: key,
			last: i === sortedDeployments.length - 1,
		}));

		return (
			<ErrorBoundary viewName="deployments">
				<FlatList
					contentContainerStyle={containerStyle}
					data={data}
					renderItem={this.renderItem}
					keyExtractor={item => item.name}
					onRefresh={reloadDeployments}
					refreshing={refreshing === 'deployments' || refreshing === 'all'}
				/>
			</ErrorBoundary>
		);
	}
}
