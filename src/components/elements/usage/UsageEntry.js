// @flow
import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components';
import { platformBlackColor } from '../../../lib/utils';

type Props = {
	usage: string | number,
	max: string | number,
	name: string,
};

const View = styled.View`
	flex-direction: column;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const Numbers = styled.View`
	flex-direction: row;
	align-items: center;
`;

const Usage = styled.Text`
	font-weight: 100;
	font-size: 40px;
	letter-spacing: 0.5px;
	color: ${platformBlackColor()};
	font-family: ${Platform.OS === 'android' ? 'sans-serif-thin' : undefined};
`;

const Max = styled.Text`
	font-size: 22px;
	color: #848484;
	font-weight: 200;
	margin-left: 10px;
`;

const Title = styled.Text`
	font-size: 17px;
	font-weight: 300;
	margin-top: 5px;
	color: ${platformBlackColor()};
`;

const Separator = styled.View`
	height: 1px;
	border-bottom-color: #eaeaea;
	border-bottom-width: 1px;
	margin-vertical: 20px;
	width: 50%;
`;

export default ({ usage, max, name }: Props) => (
	<View>
		<Numbers>
			<Usage>{usage}</Usage>
			{name !== 'Domains' && <Max>/ {max}</Max>}
		</Numbers>
		<Title>{name}</Title>
		{name !== 'Logs' && <Separator />}
	</View>
);
