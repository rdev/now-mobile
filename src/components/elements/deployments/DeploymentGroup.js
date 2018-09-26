// @flow
import React from 'react';
import styled from 'styled-components';
import Deployment from './Deployment';

type Props = {
	deployments: Zeit$Deployment[],
	name: string,
	last: boolean,
};

const View = styled.View`
	flex-direction: column;
	padding-vertical: 15px;
	${({ last, theme }) => {
		if (last) {
			return '';
		}
		return `
			border-bottom-width: 1px;
			border-bottom-color: ${theme.border};`;
	}};
`;

const Group = styled.View`
	flex-direction: column;
	padding-left: 20px;
`;

const Title = styled.Text`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 5px;
	color: ${props => props.theme.text};
`;

export default ({ deployments, name, last }: Props) => (
	<View last={last}>
		<Title>{name}</Title>
		<Group>
			{deployments.map(deployment => (
				<Deployment deployment={deployment} key={deployment.uid} />
			))}
		</Group>
	</View>
);
