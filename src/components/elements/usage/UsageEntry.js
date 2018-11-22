// @flow
import React from 'react';
import styled from 'styled-components';
import { isAndroid } from '../../../lib/utils';

type Props = {
	usage: string | number,
	max: string | number,
	name: string,
};

const View = styled.View`
	flex-direction: column;
	width: 50%;
	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-style: solid;
	border-color: ${props => props.theme.border};
	padding-vertical: 25px;
	background-color: ${props => props.theme.usageGridBackground};
`;

const Numbers = styled.View`
	flex-direction: row;
	align-items: center;
`;

const Usage = styled.Text`
	font-weight: 100;
	font-size: 32px;
	letter-spacing: 0.5px;
	color: ${props => props.theme.text};
	${isAndroid ? 'font-family: sans-serif-thin;' : ''};
`;

const Max = styled.Text`
	font-size: 18px;
	color: ${props => props.theme.lightText};
	font-weight: 200;
	margin-left: 10px;
`;

const Title = styled.Text`
	font-size: 16px;
	font-weight: 300;
	margin-top: 5px;
	color: ${props => props.theme.text};
`;

export default ({ usage, max, name }: Props) => (
	<View>
		<Numbers>
			<Usage>{usage}</Usage>
			{name !== 'Domains' && <Max>/ {max}</Max>}
		</Numbers>
		<Title>{name}</Title>
	</View>
);
