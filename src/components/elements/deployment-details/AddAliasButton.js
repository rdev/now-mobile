/* @flow */
import React, { Component } from 'react';
import { TouchableOpacity, AlertIOS, Alert } from 'react-native';
// $FlowFixMe
import Prompt from 'react-native-prompt-android'; // eslint-disable-line import/no-unresolved, import/extensions
import styled from 'styled-components';
import api from '../../../lib/api';
import { isAndroid } from '../../../lib/utils';

type Props = {
	deploymentId: string,
	reload: () => void,
	marginTop: number,
};

const ButtonText = styled.Text`
	font-weight: 300;
	font-size: 16px;
	color: ${props => props.theme.dimmedText};
`;

export default class AddAliasButton extends Component<Props> {
	createAlias = () => {
		const handler = isAndroid ? Prompt : AlertIOS.prompt;
		handler('Enter domain to alias', null, [
			{
				text: 'Cancel',
				onPress: () => console.log('Aliasing cancelled'),
				style: 'cancel',
			},
			{
				text: 'Alias',
				onPress: this.handleCreateAlias,
			},
		]);
	};

	handleCreateAlias = async (alias: string) => {
		const { deploymentId } = this.props;

		const { error } = await api.aliases.createAlias(deploymentId, alias);

		if (error) {
			console.log('ALIAS CREATION ERROR', error);
			Alert.alert('There was error creating alias', error.message);
		} else {
			this.props.reload();
		}
	};

	render() {
		return (
			<TouchableOpacity
				activeOpacity={0.65}
				onPress={this.createAlias}
				style={{ marginBottom: 20, marginTop: this.props.marginTop }}
			>
				<ButtonText>Add new alias...</ButtonText>
			</TouchableOpacity>
		);
	}
}
