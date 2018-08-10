/* @flow */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import { platformBlackColor, isAndroid, promptOpen } from '../../../lib/utils';
import GoIcon from '../../../../assets/go.png';

type Props = {
	name: string,
	value: string | Date,
	link?: ?string,
	small?: boolean,
	last?: boolean,
};

const View = styled.View`
	flex-direction: column;
	padding-vertical: 10px;
	width: ${({ small }) => (small ? '45%' : '100%')};
	${({ last }) => {
		if (last) {
			return 'margin-bottom: 20px';
		}
		return `
			border-bottom-width: 1px;
			border-bottom-color: #EAEAEA;
		`;
	}};
`;

const Title = styled.Text`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 5px;
	color: ${platformBlackColor};
`;

const Content = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${({ value }) =>
		(value === 'ERROR' ? '#D74C58' : value === 'INITIALIZING' ? '#E2B538' : platformBlackColor)};
`;

const Button = styled.TouchableOpacity`
	flex-direction: row;
	align-items: ${isAndroid ? 'flex-start' : 'baseline'};
`;

const Go = styled.Image`
	width: 15px;
	height: 14px;
	margin-left: 10px;
	margin-top: ${isAndroid ? '6px' : 0};
`;

export default ({
	name, value, last, link, small,
}: Props) => (
	<View last={last} small={small}>
		<Title>{name}</Title>
		{link ? (
			<Button activeOpacity={0.65} onPress={() => promptOpen(link)}>
				<Content>{value}</Content>
				<Go source={GoIcon} />
			</Button>
		) : (
			<Content value={value}>
				{value instanceof Date ? (
					<Content>
						{value.toString()} <TimeAgo date={value.toString()} bracketed />
					</Content>
				) : (
					value
				)}
			</Content>
		)}
	</View>
);
