// @flow
import React from 'react';
import { SafeAreaView, AsyncStorage } from 'react-native';
import TouchID from 'react-native-touch-id';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { viewport, isIphoneX, isAndroid } from '../lib/utils';
import touchIdPrompt from '../lib/touch-id-prompt';
import ZeitLogo from '../../assets/zeit-logo.png';
import NetworkError from '../components/NetworkError';
import { connect } from '../Provider';

type Props = {
	navigation: Navigation,
	context: any | Context,
};

const View = styled(SafeAreaView)`
	background-color: white;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const logoStyle = {
	top: viewport.height / 2 - 90,
	left: viewport.width / 2 - 60,
	width: 120,
	height: 107,
};

Animatable.initializeRegistryWithDefinitions({
	transitionToAuth: {
		from: logoStyle,
		to: {
			left: viewport.width / 2 - 32,
			top: viewport.height * 0.17,
			height: 57,
			width: 64,
		},
	},
	// Originally I wanted it to slide to the top left where Zeit logo is in the main screen
	// But it's a pain to do on multiple screen sizes, so until a good way to do it is found,
	// it's just gonna be a fade-out
	transitionToMain: {
		from: {
			...logoStyle,
			opacity: 1,
		},
		to: {
			left: viewport.width / 2,
			top: viewport.height / 2 - 45,
			width: 0,
			height: 0,
			opacity: 0,
		},
	},
});

@connect
export default class SplashScreen extends React.Component<Props> {
	componentDidMount = async () => {
		this.logo.fadeIn(500);
		this.initialLoad();
	};

	logo: Animatable.Image;

	// While we're here, let's pull all our data into context, so when the views are rendered
	// they have all the data they need. Or redirect to Auth if there's no token
	initialLoad = async () => {
		try {
			const token = await AsyncStorage.getItem('@now:token');

			if (token) {
				const biometricAuth = await this.touchId();

				if (!biometricAuth) {
					await AsyncStorage.removeItem('@now:token');
					await AsyncStorage.removeItem('@now:touchId');

					this.props.navigation.replace('Authentication');
					return;
				}

				await this.props.context.fetchData();
				await this.logo.transitionToMain(600);

				this.props.navigation.replace('Main');
			} else {
				await this.logo.transitionToAuth(600);

				this.props.navigation.replace('Authentication');
			}
		} catch (e) {
			console.log('INITIAL LOAD ERROR', e);
		}
	};

	touchId = (): Promise<boolean> =>
		new Promise(async (resolve) => {
			const pin = await AsyncStorage.getItem('@now:touchId');

			if (!pin) {
				resolve(true);
				return;
			}

			try {
				await TouchID.authenticate('To log in to your Now account', {
					color: '#000000',
					fallbackLabel: 'Use PIN',
				});
				resolve(true);
			} catch (e) {
				if (isAndroid) {
					const pinResult = await this.pinPrompt(pin);
					resolve(pinResult);
				} else if (
					// Other error types shouldn't happen at all
					e.name === 'LAErrorUserCancel' ||
					e.name === 'LAErrorUserFallback' ||
					e.name === 'LAErrorAuthenticationFailed' ||
					e.name === 'LAErrorSystemCancel'
				) {
					const pinResult = await this.pinPrompt(pin);
					resolve(pinResult);
				} else if (e.name === 'RCTTouchIDNotSupported') {
					// Touch ID has been disabled due to a bunch of failed attempts
					// It's re-enabled by entering the passcode on lock screen, but we're already here
					const pinResult = await this.pinPrompt(pin, null, true);
					resolve(pinResult);
				}
			}
		});

	pinPrompt = (pin: string, retry?: ?boolean, touchIdDisabled?: boolean): Promise<boolean> =>
		new Promise(async (resolve) => {
			await touchIdPrompt({
				text: retry
					? `The ${isAndroid ? 'password' : 'pin'} you enterred was incorrect`
					: touchIdDisabled
						? `${
							isIphoneX() ? 'Face' : 'Touch'
						  } ID has been disabled. Use your PIN to log in.`
						: '',
				cancelLabel: 'Log Out',
				onCancel: () => resolve(false),
				onPress: async (enteredPin) => {
					if (enteredPin === pin) {
						resolve(true);
					} else {
						const retryAttempt = await this.pinPrompt(pin, true);
						resolve(retryAttempt);
					}
				},
			});
		});

	render() {
		return (
			<View>
				<Animatable.Image
					source={ZeitLogo}
					style={{ position: 'absolute', ...logoStyle }}
					ref={(ref) => {
						this.logo = ref;
					}}
				/>
				{/* $FlowFixMe */}
				<NetworkError />
			</View>
		);
	}
}
