// @flow
import React, { Component } from 'react';
import { AsyncStorage, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import Logo from '../components/Logo';
import AuthInput from '../components/elements/AuthInput';
import api from '../lib/api';
import { viewport } from '../lib/utils';
import { connect } from '../Provider';

type State = {
	code?: string,
	email?: string,
};

type Props = {
	navigation: Navigation,
};

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

/**
 * Authentication screen. This is going to ask for an email or a token.
 * Token will be saved and used right away. Email will follow Zeit's normal login flow.
 *
 * @export
 * @class Authentication
 * @extends {React.Component}
 */
@connect
export default class Authentication extends Component<Props, State> {
	state = {};

	checker: IntervalID;

	login = async (input: string) => {
		// If it's an email
		if (input.includes('@')) {
			const res = await api.auth.login(input);

			if (res.error) {
				// @TODO Error message (or on API level? TBD)
			} else {
				await AsyncStorage.setItem('@now:preauthToken', res.token);
				this.setState(
					{
						code: res.securityCode,
						email: input,
					},
					() => this.verify(input),
				);
			}
		} else if (input.length === 24) {
			// If this is a valid token
			await AsyncStorage.setItem('@now:token', input);
			const res = await api.user.vitals();

			if (res.user) {
				await this.props.context.fetchData();
				this.props.navigation.replace('Main');
			} else {
				// Nope
				AsyncStorage.removeItem('@now:token');
				// @TODO Error message
			}
		}
		// Otherwise do nothing
		// @TODO Probably should have some error message here
	};

	verify = (email: string) => {
		// Following Zeit's website / Now Desktop, we're gonna check every 3s if email has been verified
		this.checker = setInterval(async () => {
			const res = await api.auth.verify(email);
			console.log(res);
			if (res.token) {
				clearInterval(this.checker);
				await AsyncStorage.setItem('@now:token', res.token);
				await this.props.context.fetchData();
				this.props.navigation.replace('Main');
			}
		}, 3000);
	};

	render() {
		return (
			<Container>
				<Animatable.View animation="fadeIn" duration={600} style={{ width: '100%' }}>
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
						{(() => {
							if (this.state.code) {
								return (
									// $FlowFixMe
									<React.Fragment>
										<Header>Awaiting Confirmation</Header>
										<Text>
											An email with a verification code was sent to{' '}
											<Email>{this.state.email}</Email>
										</Text>
										<Text style={{ marginTop: 20 }}>
											Make sure it matches the following:
										</Text>
										<Code>
											<CodeText>{this.state.code}</CodeText>
										</Code>
									</React.Fragment>
								);
							}
							return <AuthInput onSubmit={this.login} />;
						})()}
					</KeyboardAwareScrollView>
				</Animatable.View>
				<Logo size="large" style={{ position: 'absolute', top: viewport.height * 0.17 }} />
			</Container>
		);
	}
}
