// @flow
import React from 'react';
import { Clipboard } from 'react-native';
import styled from 'styled-components';

type Props = {
	onSubmit: (value: string) => Promise<*>,
}

type State = {
	value: ?string,
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

export default class AuthInput extends React.Component<Props, State> {
	state = {
		value: null,
	};

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

	render() {
		return (
			<Input
				placeholder="Email or Token"
				keyboardType="email-address"
				onFocus={this.checkClipboard}
				onChangeText={this.handleInput}
				onSubmitEditing={() => this.props.onSubmit(this.state.value)}
				value={this.state.value}
				autoCapitalize="none"
			/>
		);
	}
}
