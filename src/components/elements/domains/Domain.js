// @flow
import React from 'react';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import ExpireDate from './ExpireDate';

type Props = {
	domain: Zeit$Domain,
}

const View = styled.View`
	flex-direction: row;
	margin-bottom: 15px;
`;

const LeftSide = styled.View`
	flex-direction: column;
	flex: 1;
`;

const Title = styled.Text`
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 5px;
`;

export default ({ domain }: Props) => (
	<View>
		<LeftSide>
			<Title>{domain.name}</Title>
			<ExpireDate date={domain.expiresAt} />
		</LeftSide>
		<TimeAgo date={domain.created} />
	</View>
);

