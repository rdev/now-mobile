// @flow
import React from 'react';
import { Linking, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import GoIcon from '../../../../assets/go.png';

type Props = {
	alias: Zeit$Alias,
	last: boolean,
}

const View = styled.View`
	flex-direction: row;
	padding-vertical: 20px;
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

const TitleWrap = styled.View`
	flex-direction: row;
	align-items: baseline;
`;

const Title = styled.Text`
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 5px;
`;

const Deployment = styled.Text`
	font-size: 18px
	font-weight: 300;
`;

const Go = styled.Image`
	width: 15px;
	height: 14px;
	margin-left: 10px;
`;

function promptOpen(path: string) {
	Alert.alert(
		'Open in Safari',
		`Do you want to open ${path} in browser?`,
		[
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Open', onPress: () => Linking.openURL(`https://${path}`) },
		],
		{ cancelable: false },
	);
}

export default ({ alias, last }: Props) => (
	<View last={last}>
		{/* $FlowFixMe */}
		<React.Fragment>
			<LeftSide>
				<TouchableOpacity activeOpacity={0.7} onPress={() => promptOpen(alias.alias)}>
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

