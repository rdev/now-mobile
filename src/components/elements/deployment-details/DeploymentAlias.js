/* @flow */
import React, { Component } from 'react';
import { Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import styled from 'styled-components';
import { connect } from '../../../Provider';
import api from '../../../lib/api';
import { platformBlackColor } from '../../../lib/utils';

type Props = {
	alias: Zeit$Alias,
	context: Context,
	reload: () => void,
};

const Wrapper = styled.View`
	flex-direction: column;
	padding-vertical: 10px;
	width: 100%;
	border-bottom-width: 1px;
	border-bottom-color: #eaeaea;
`;

const Text = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${platformBlackColor};
`;

@connect
export default class DeploymentAlias extends Component<Props> {
	removeAlias = async () => {
		const { alias, context, reload } = this.props;
		Alert.alert(
			'Remove alias',
			`Are you sure you want to remove ${alias.alias}?`,
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Remove',
					onPress: async () => {
						const { status } = await api.aliases.removeAlias(alias.uid);
						context.reloadAliases();
						if (status === 'SUCCESS') {
							reload();
						} else {
							Alert.alert('Unable to remove alias');
						}
					},
					style: 'destructive',
				},
			],
			{ cancelable: false },
		);
	};

	render() {
		return (
			<Swipeout
				right={[{ text: 'Remove', type: 'delete', onPress: this.removeAlias }]}
				backgroundColor="white"
			>
				<Wrapper>
					<Text>{this.props.alias.alias}</Text>
				</Wrapper>
			</Swipeout>
		);
	}
}
