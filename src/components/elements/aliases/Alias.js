// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import { isAndroid, promptOpen } from '../../../lib/utils';
import GoIcon from '../../../../assets/go.png';

type Props = {
	alias: Zeit$Alias,
	last: boolean,
};

const View = styled.View`
	flex-direction: row;
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

const LeftSide = styled.View`
	flex-direction: column;
	flex: 1;
`;

const TitleWrap = styled.View`
	flex-direction: row;
	align-items: ${isAndroid ? 'flex-start' : 'baseline'};
`;

const Title = styled.Text`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 5px;
	color: ${props => props.theme.text};
`;

const Deployment = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${props => props.theme.text};
`;

const Go = styled.Image`
	width: 15px;
	height: 14px;
	margin-left: 10px;
	margin-top: ${isAndroid ? '6px' : 0};
`;

export default ({ alias, last }: Props) => (
	<View last={last}>
		{/* $FlowFixMe */}
		<React.Fragment>
			<LeftSide>
				<TouchableOpacity activeOpacity={0.6} onPress={() => promptOpen(alias.alias)}>
					<TitleWrap>
						<Title>{alias.alias}</Title>
						<Go source={GoIcon} />
					</TitleWrap>
				</TouchableOpacity>
				<Deployment>{alias.deployment.url}</Deployment>
			</LeftSide>
			<TimeAgo date={alias.created} />
		</React.Fragment>
	</View>
);
