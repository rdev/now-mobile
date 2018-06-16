import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
import StorybookUI from './storybook';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const STORYBOOK = true;

AppRegistry.registerComponent('now', () => (STORYBOOK ? StorybookUI : App));
