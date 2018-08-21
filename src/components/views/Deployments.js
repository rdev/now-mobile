// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import isEqual from 'react-fast-compare';
import ErrorBoundary from '../ErrorBoundary';
import EmptyResults from '../EmptyResults';
import { connect } from '../../Provider';
import DeploymentGroup from '../elements/deployments/DeploymentGroup';

type Props = {
	context: Context,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class Deployments extends Component<Props> {
	state = {
		sortedDeployments: {},
	};

	static getDerivedStateFromProps(props, state) {
		const deployments = props.context.deployments.sort((a, b) => {
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

		if (!isEqual(sortedDeployments, state.sortedDeployments)) {
			return {
				sortedDeployments,
			};
		}

		return null;
	}

	renderItem = ({ item, i }: { item: Zeit$Deplyment, i: number }) => (
		<DeploymentGroup
			deployments={this.state.sortedDeployments[item]}
			name={item}
			last={i === this.state.length - 1}
			key={i}
		/>
	);

	render() {
		const { context } = this.props;

		return (
			<ErrorBoundary viewName="deployments">
				<FlatList
					contentContainerStyle={containerStyle}
					data={Object.keys(this.state.sortedDeployments)}
					ListEmptyComponent={<EmptyResults viewName="deployments" />}
					renderItem={this.renderItem}
					onEndReached={this.loadMore}
					keyExtractor={item => item}
					onRefresh={() => context.reloadDeployments(true)}
					refreshing={context.refreshing}
				/>
			</ErrorBoundary>
		);
	}
}
