import { StackNavigator } from 'react-navigation';
// import { AsyncStorage } from 'react-native';
import Authentication from './screens/Authentication';
import Main from './screens/Main';

export default StackNavigator({
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
