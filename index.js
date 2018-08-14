import { AppRegistry, YellowBox } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import App from './src/App';
import StorybookUI from './storybook';
import { task as BackgroundTask } from './src/lib/background-task';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const STORYBOOK = false;

AppRegistry.registerComponent('now', () => (__DEV__ && STORYBOOK ? StorybookUI : App));
BackgroundFetch.registerHeadlessTask(BackgroundTask);
