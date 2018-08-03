// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
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
	render() {
		const { deployments } = this.props.context;
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

		return (
			<ErrorBoundary viewName="deployments">
				<ScrollView contentContainerStyle={containerStyle}>
					{Object.keys(sortedDeployments).map((key, i) => (
						<DeploymentGroup
							deployments={sortedDeployments[key]}
							name={key}
							last={i === sortedDeployments.length - 1}
							key={key}
						/>
					))}
				</ScrollView>
			</ErrorBoundary>
		);
	}
}
