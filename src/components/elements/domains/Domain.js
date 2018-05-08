// @flow
import React from 'react';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import ExpireDate from './ExpireDate';

type Props = {
	domain: Zeit$Domain,
	last: boolean,
}

const View = styled.View`
	flex-direction: row;
	padding-top: 10px;
	padding-bottom: 10px;
	${({ last }) => {
		if (last) {
			return '';
		}
		return `
				border-bottom-width: 1px;
				border-bottom-color: #EAEAEA;
		`;
	}}
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

export default ({ domain, last }: Props) => (
	<View last={last}>
		<LeftSide>
			<Title>{domain.name}</Title>
			<ExpireDate date={domain.expiresAt} />
		</LeftSide>
		<TimeAgo date={domain.created} />
	</View>
);

