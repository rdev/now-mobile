import React from 'react';
import { StackNavigator } from 'react-navigation';
import codePush from 'react-native-code-push';
import SplashScreen from './screens/SplashScreen';
import Authentication from './screens/Authentication';
import Main from './screens/Main';
import WhatsNew from './screens/WhatsNew';
import Settings from './screens/Settings';
import DeploymentDetails from './screens/DeploymentDetails';
import { Provider } from './Provider';
import { platformBlackColor } from './lib/utils';

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

const App = StackNavigator(
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

const NowApp = () => (
	<Provider>
		<App />
	</Provider>
);

export default codePush(NowApp);
