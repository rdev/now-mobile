// @flow
import React from 'react';
import styled from 'styled-components';
import { platformBlackColor } from '../../../lib/utils';

type Props = {
	onSystemPress: Function,
	onTeamPress: Function,
	onMePress: Function,
	active: 'system' | 'team' | 'me',
	team: any,
};

const View = styled.View`
	flex-direction: row;
	justify-content: space-around;
	padding-vertical: 8px;
	border-radius: 6px;
	border-color: #dedede;
	border-width: 1px;
	margin-bottom: 10px;
	width: 100%;
`;

const Switch = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
	flex: 1;
	border-right-color: #dedede;
	border-right-width: ${({ border }) => (border ? '1px' : '0')};
`;

const Text = styled.Text`
	font-size: 14px;
	font-weight: 300;
	color: ${({ active }) => (active ? platformBlackColor : '#848484')};
`;

export default ({
	onSystemPress, onTeamPress, onMePress, team, active,
}: Props) => (
	<View>
		<Switch activeOpacity={0.7} border onPress={onSystemPress}>
			<Text active={active === 'system'}>System</Text>
		</Switch>
		{(() =>
			(team ? (
				<Switch activeOpacity={0.7} border onPress={onTeamPress}>
					<Text active={active === 'team'}>Team</Text>
				</Switch>
			) : null))()}
		<Switch activeOpacity={0.7} onPress={onMePress}>
			<Text active={active === 'me'}>{team ? 'Just Me' : 'Me'}</Text>
		</Switch>
	</View>
);
