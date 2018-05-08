import React from 'react';
import { StackNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import Authentication from './screens/Authentication';
import Main from './screens/Main';
import { Provider } from './Provider';

const App = StackNavigator({
	Splash: {
		screen: SplashScreen,
	},
	Authentication: {
		screen: Authentication,
	},
	Main: {
		screen: Main,
	},
}, {
	headerMode: 'none',
});

export default () => (
	<Provider>
		<App />
	</Provider>
);
