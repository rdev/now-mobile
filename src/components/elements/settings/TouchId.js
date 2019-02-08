// @flow
import React from 'react';
import { Switch, AsyncStorage } from 'react-native';
import { isAndroid, themes } from '../../../lib/utils';
import touchIdPrompt from '../../../lib/touch-id-prompt';
import Separator from './Separator';
import SettingsRow from './SettingsRow';
import RowText from './RowText';

type Props = {
	biometry?: string,
	darkMode: boolean,
};

type State = {
	touchId: boolean,
};


class TouchId extends React.Component<Props, State> {
	state = {
		touchId: false,
	}

	componentDidMount = () => {
		this.setTouchId();
	};

	setTouchId = async () => {
		const touchIdEnabled = await AsyncStorage.getItem('@now:touchId');
		if (touchIdEnabled) {
			this.setState({ touchId: true });
		}
	};

	toggleTouchId = async (active: boolean) => {
		const { biometry } = this.props;

		if (active && biometry !== undefined) {
			console.log('biometry active');
			// $FlowFixMe this method won't ever be called if 'biometry === undefined'
			try {
				await touchIdPrompt({
					biometryType: isAndroid
						? 'fingerprint'
						: `${biometry.replace(/^\w/, c => c.toUpperCase())} ID`,
				});
				this.setState({ touchId: true });
			} catch (e) {
				console.log('ERROR SETTING TOUCH ID', e);
			}
		} else {
			await AsyncStorage.removeItem('@now:touchId');
			this.setState({ touchId: false });
		}
	};

	render() {
		const { biometry, darkMode } = this.props;

		console.log('biometry', biometry);

		if (biometry) {
			return (
				// $FlowFixMe
				<React.Fragment>
					<Separator />
					<SettingsRow>
						<RowText>
							Use{' '}
							{isAndroid
								? 'fingerprint'
								: `${biometry.replace(/^\w/, c =>
									c.toUpperCase())} ID`}
						</RowText>
						<Switch
							onTintColor={
								isAndroid
									? '#bbbbbb'
									: darkMode
										? themes.dark.text
										: themes.light.text
							}
							thumbTintColor={
								isAndroid
									? darkMode
										? themes.dark.text
										: themes.light.text
									: null
							}
							value={this.state.touchId}
							onValueChange={this.toggleTouchId}
						/>
					</SettingsRow>
				</React.Fragment>
			);
		}

		return null;
	}
}

export default TouchId;
