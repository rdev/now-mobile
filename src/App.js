import React from 'react';
import { StackNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import Authentication from './screens/Authentication';
import Main from './screens/Main';
import Settings from './screens/Settings';
import { Provider } from './Provider';

const App = StackNavigator(
	{
		Splash: {
			screen: SplashScreen,
		},
		Authentication: {
			screen: Authentication,
		},
		Main: {
			screen: Main,
		},
		Settings: {
			screen: Settings,
		},
	},
	{
		headerMode: 'none',
	},
);

export default () => (
	<Provider>
		<App />
	</Provider>
);
