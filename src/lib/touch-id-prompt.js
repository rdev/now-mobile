/* @flow */
// This is chaos -_-

// $FlowFixMe
import Prompt from 'react-native-prompt-android'; // eslint-disable-line import/no-unresolved, import/extensions
import { AlertIOS, Platform, AsyncStorage } from 'react-native';

type TouchIDOptions = {
	biometryType?: string,
	text?: string,
	cancelLabel?: string,
	onCancel?: Function,
	onPress?: Function,
};

export default function touchIdPrompt({
	biometryType = 'Touch ID',
	text,
	cancelLabel,
	onCancel,
	onPress,
}: TouchIDOptions): Promise<void> {
	return new Promise((resolve) => {
		if (Platform.OS === 'ios') {
			AlertIOS.prompt(
				'Enter PIN',
				typeof text === 'undefined'
					? `This will be used if ${biometryType} doesn't work`
					: text,
				[
					{
						text: cancelLabel || 'Cancel',
						onPress: () => {
							if (onCancel) onCancel();
						},
						style: 'cancel',
					},
					{
						text: 'OK',
						onPress: async (pin) => {
							if (onPress) {
								onPress(pin);
								resolve();
							} else {
								await AsyncStorage.setItem('@now:touchId', pin);
								resolve();
							}
						},
					},
				],
				'secure-text',
				undefined,
				'number-pad',
			);
		} else {
			Prompt(
				'Enter Password',
				typeof text === 'undefined'
					? `This will be used if ${biometryType} doesn't work`
					: text,
				[
					{
						text: cancelLabel || 'Cancel',
						onPress: () => {
							if (onCancel) onCancel();
						},
						style: 'cancel',
					},
					{
						text: 'OK',
						onPress: async (pin) => {
							if (onPress) {
								onPress(pin);
								resolve();
							} else {
								await AsyncStorage.setItem('@now:touchId', pin);
								resolve();
							}
						},
					},
				],
				{
					type: 'secure-text',
				},
			);
		}
	});
}
