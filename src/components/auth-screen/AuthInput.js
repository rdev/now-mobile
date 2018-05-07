// @flow
import React from 'react';
import { Clipboard } from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { validEmail } from '../../lib/utils';

type Props = {
	onSubmit: (value: string) => Promise<*>,
}

type State = {
	value: ?string,
	validationError: boolean,
}

const Input = styled.TextInput`
	color: black;
	font-size: 18px;
	font-weight: 300;
	width: 70%;
	border-bottom-width: 1px;
	border-bottom-color: ${({ value }) => (value ? 'black' : '#D3D3D3')};
	text-align: center;
	padding-vertical: 10px;
`;

const ValidationHint = styled.Text`
	font-size: 15px;
	font-weight: 300;
	margin-top: 10px;
	color: #EC6262;
`;

export default class AuthInput extends React.Component<Props, State> {
	state = {
		value: null,
		validationError: false,
	};

	validationMessage: Animatable.View;

	handleInput = (value: string) => {
		this.setState({ value });
	}

	// Let's see if they have email/token copied
	// If they do, autopaste it for them
	checkClipboard = async () => {
		const value = await Clipboard.getString();
		if (value.includes('@') || value.length === 24) {
			this.setState({ value });
		}
	}

	handleSubmit = () => {
		const { value } = this.state;
		if (value) {
			if (validEmail(value) || value.length === 24) {
				this.props.onSubmit(value);
			} else {
				this.setState({ validationError: true });
			}
		}
	}

	render() {
		const { validationError } = this.state;
		return (
			<React.Fragment>
				<Input
					placeholder="Email or Token"
					keyboardType="email-address"
					onFocus={this.checkClipboard}
					onChangeText={this.handleInput}
					onSubmitEditing={this.handleSubmit}
					value={this.state.value}
					autoCapitalize="none"
				/>
				<Animatable.View ref={this.validationMessage} duration={600} transition="opacity" style={{ opacity: validationError ? 1 : 0 }}>
					<ValidationHint>
						That doesn’t look like an email or a token
					</ValidationHint>
				</Animatable.View>
			</React.Fragment>
		);
	}
}
