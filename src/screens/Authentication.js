// @flow
import React, { Component } from 'react';
import { AsyncStorage, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import Logo from '../components/Logo';
import AuthInput from '../components/elements/AuthInput';
import api from '../lib/api';

type State = {
	code?: string,
	email?: string,
}

type Props = {
	navigation: Navigation,
}

const Container = styled(SafeAreaView)`
	height: 100%;
	width: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: white;
`;

const Header = styled.Text`
	font-size: 22px;
	font-weight: 600;
	margin-bottom: 20px;
`;

const Text = styled.Text`
	font-size: 17px;
	width: 80%;
	text-align: center;
`;

const Email = styled.Text`
	font-size: 17px;
	font-weight: 600;
`;

const Code = styled.View`
	width: 80%;
	background-color: #f7f7f7;
	justify-content: center;
	align-items: center;
	height: 50px;
	margin-top: 20px;
	border-radius: 4px;
`;

const CodeText = styled.Text`
	font-size: 20px;
	font-weight: 600;
`;

export default class Authentication extends Component<Props, State> {
	state = {};

	// @TODO Remove in favor of Splash screen
	componentWillMount = async () => {
		const token = await AsyncStorage.getItem('@now:token');
		if (token) {
			this.props.navigation.replace('Main');
		}
	}

	checker: IntervalID;

	login = async (input: string) => {
		if (input.includes('@')) {
			const res = await api.auth.login(input);

			if (res.error) {
				//
			} else {
				await AsyncStorage.setItem('@now:preauthToken', res.token);
				this.setState({
					code: res.securityCode,
					email: input,
				}, () => this.verify(input));
			}
		} else if (input.length === 24) {
			// See if this is a valid token
			await AsyncStorage.setItem('@now:token', input);
			const res = await api.user.vitals();

			if (res.user) {
				this.props.navigation.replace('Main');
			} else {
				// Nope
				AsyncStorage.removeItem('@now:token');
			}
		}
	}

	verify = (email: string) => {
		this.checker = setInterval(async () => {
			const res = await api.auth.verify(email);
			if (res.token) {
				clearInterval(this.checker);
				await AsyncStorage.setItem('@now:token', res.token);
				this.props.navigation.replace('Main');
			}
		}, 3000);
	}

	render() {
		return (
			<Container>
				<KeyboardAwareScrollView
					contentContainerStyle={{
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					}}
					style={{
						width: '100%',
					}}
					scrollEnabled={false}
				>
					<Logo size="large" style={{ position: 'absolute', top: '15%' }} />
					{(() => {
						if (this.state.code) {
							return (
								// $FlowFixMe
								<React.Fragment>
									<Header>Awaiting Confirmation</Header>
									<Text>
									An email with a verification code was sent to{' '}
										<Email>
											{this.state.email}
										</Email>
									</Text>
									<Text style={{ marginTop: 20 }}>
									Make sure it matches the following:
									</Text>
									<Code>
										<CodeText>
											{this.state.code}
										</CodeText>
									</Code>
								</React.Fragment>
							);
						}
						return (
							<AuthInput onSubmit={this.login} />
						);
					})()}
				</KeyboardAwareScrollView>
			</Container>
		);
	}
}
