// @flow
import React from 'react';
import { SafeAreaView, AsyncStorage } from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { viewport } from '../lib/utils';
import ZeitLogo from '../../assets/zeit-logo.png';
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
		const token = await AsyncStorage.getItem('@now:token');
		if (token) {
			await this.props.context.fetchData();
			await this.logo.transitionToMain(600);

			this.props.navigation.replace('Main');
		} else {
			await this.logo.transitionToAuth(600);

			this.props.navigation.replace('Authentication');
		}
	};

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
			</View>
		);
	}
}
