/* @flow */

import React from 'react';
import { StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import codePush from 'react-native-code-push';
import { ThemeProvider } from 'styled-components';
import SplashScreen from './screens/SplashScreen';
import Authentication from './screens/Authentication';
import Main from './screens/Main';
import WhatsNew from './screens/WhatsNew';
import Settings from './screens/Settings';
import DeploymentDetails from './screens/DeploymentDetails';
import { Provider, connect } from './Provider';
import { themes } from './lib/utils';

type AppProps = {
	context: Context,
};

const MainStack = StackNavigator(
	{
		Splash: {
			screen: SplashScreen,
			navigationOptions: { header: null },
		},
		Authentication: {
			screen: Authentication,
			navigationOptions: { header: null },
		},
		Main: {
			screen: Main,
			navigationOptions: { header: null },
		},
		Settings: {
			screen: Settings,
			navigationOptions: { header: null },
		},
		DeploymentDetails: {
			screen: DeploymentDetails,
			navigationOptions: ({ screenProps }) => ({
				title: 'Deployment',
				headerTintColor: screenProps.theme.text,
				backTitle: 'Back',
				headerStyle: {
					borderBottomColor: 'transparent',
					borderBottomWidth: 0,
					backgroundColor: screenProps.theme.background,
				},
				headerTitleStyle: {
					color: screenProps.theme.text,
				},
			}),
		},
	},
	{ headerMode: 'screen' },
);

const Navigation = StackNavigator(
	{
		MainView: {
			screen: MainStack,
		},
		WhatsNew: {
			screen: WhatsNew,
		},
	},
	{
		mode: 'modal',
		headerMode: 'none',
	},
);

const App = connect(({ context }: AppProps) => (
	<ThemeProvider theme={context.darkMode ? themes.dark : themes.light}>
		{/* $FlowFixMe */}
		<React.Fragment>
			<StatusBar barStyle={context.darkMode ? 'light-content' : 'dark-content'} />
			<Navigation screenProps={{ theme: context.darkMode ? themes.dark : themes.light }} />
		</React.Fragment>
	</ThemeProvider>
));

const NowApp = () => (
	<Provider>
		<App />
	</Provider>
);

export default codePush(NowApp);
