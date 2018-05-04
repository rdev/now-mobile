import { StackNavigator } from 'react-navigation';
import Authentication from './screens/Authentication';

export default StackNavigator({
	Authentication: {
		screen: Authentication,
	},
}, {
	headerMode: 'none',
});
