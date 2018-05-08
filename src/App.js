import React from 'react';
import { StackNavigator } from 'react-navigation';
import Authentication from './screens/Authentication';
import { Provider } from './Provider';
import Main from './screens/Main';

const App = StackNavigator({
	// Splash: {
	// 	screen: SplashScreen,
	// },
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
