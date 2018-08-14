/* @flow */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { platformBlackColor } from '../../../lib/utils';
import Item from './Item';
import ScaleTable from './ScaleTable';
import EventList from './EventList';

type Props = {
	scale: any,
	deployment: Zeit$Deployment,
	events: Zeit$Event[],
};

const View = styled(Animatable.View)`
	margin-top: 10px;
`;

const Heading = styled.Text`
	font-size: 22px;
	font-weight: 700;
	margin-bottom: 20px;
	color: ${platformBlackColor};
`;

const MultiWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

export default ({ scale, deployment, events }: Props) => (
	<View animation="fadeIn" duration={500}>
		<Heading>Meta</Heading>
		<Item name="uid" value={deployment.uid} />
		<Item name="name" value={deployment.name} />
		<MultiWrap>
			<Item name="state" value={deployment.state} small />
			<Item name="type" value={deployment.type} small />
		</MultiWrap>
		<Item name="url" value={deployment.url || '-'} link={deployment.url || null} />
		<Item name="created" value={new Date(deployment.created)} last />
		{deployment.type === 'STATIC' ? null : (
			<Fragment>
				<Heading>Scale</Heading>
				<ScaleTable scale={scale} deployment={deployment} />
				<Heading>Events</Heading>
				<EventList events={events} />
			</Fragment>
		)}
	</View>
);
