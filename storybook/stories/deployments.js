/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import DeploymentGroup from '../../src/components/elements/deployments/DeploymentGroup';
import Deployment from '../../src/components/elements/deployments/Deployment';
import center from './_center';

const DeploymentStories = storiesOf('Deployment', module).addDecorator(center);

const deployment = {
	url: 'zeit-vbcxbzxcba.now.sh',
	scale: { current: 2 },
	state: 'READY',
	created: '2018-06-16T17:13:01.908Z',
};
DeploymentStories.add('Default', () => <Deployment deployment={deployment} />);
DeploymentStories.add('Static', () => <Deployment deployment={{ ...deployment, scale: null }} />);
DeploymentStories.add('Errorred', () => (
	<Deployment deployment={{ ...deployment, scale: null, state: 'BUILD_ERROR' }} />
));

const DeploymentGroupStories = storiesOf('DeploymentGroup', module).addDecorator(center);
DeploymentGroupStories.add('Default', () => (
	<DeploymentGroup
		deployments={[
			deployment,
			{ ...deployment, scale: null, url: 'zeit-vcaczbvcgd.now.sh' },
			{
				...deployment,
				scale: null,
				url: 'zeit-dabvzxcvcv.now.sh',
				state: 'BUILD_ERROR',
			},
		]}
		name="zeit"
	/>
));

DeploymentGroupStories.add('Borderless', () => (
	<DeploymentGroup
		deployments={[
			{ ...deployment, url: 'api-docs-habcnzxcvc.now.sh' },
			{ ...deployment, scale: null, url: 'api-docs-vcaczbvcgd.now.sh' },
			{
				...deployment,
				scale: null,
				url: 'api-docs-dabvzxcvcv.now.sh',
				state: 'BUILD_ERROR',
			},
		]}
		name="api-docs"
		last
	/>
));
