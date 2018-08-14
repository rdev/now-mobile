import React from 'react';
import { StackNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import Authentication from './screens/Authentication';
import Main from './screens/Main';
import Settings from './screens/Settings';
import DeploymentDetails from './screens/DeploymentDetails';
import { Provider } from './Provider';
import { platformBlackColor } from './lib/utils';

const App = StackNavigator(
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
			navigationOptions: {
				title: 'Deployment',
				headerTintColor: platformBlackColor,
				backTitle: 'Back',
				headerStyle: {
					borderBottomColor: 'transparent',
					borderBottomWidth: 0,
					backgroundColor: 'white',
				},
				headerTitleStyle: {
					color: platformBlackColor,
				},
			},
		},
	},
	{ headerMode: 'screen' },
);

export default () => (
	<Provider>
		<App />
	</Provider>
);
