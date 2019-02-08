// @TODO This component is getting too huge for comfort
// @flow
import React from 'react';
import {
	SafeAreaView,
	TouchableOpacity,
	Switch,
} from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';
import Dropdown from '../components/Dropdown';
import Separator from '../components/elements/settings/Separator';
import SettingsRow from '../components/elements/settings/SettingsRow';
import RowText from '../components/elements/settings/RowText';
import Button from '../components/elements/settings/Button';
import Profile from '../components/elements/settings/Profile';
import TouchId from '../components/elements/settings/TouchId';
import UsageLimits from '../components/elements/settings/UsageLimits';
import { isIphoneSE, isAndroid, themes } from '../lib/utils';
import { connect } from '../Provider';

type Props = {
	context: Context,
};

const Container = styled(SafeAreaView)`
	width: 100%;
	flex: 1;
	flex-direction: column;
	background-color: ${props => props.theme.background};
`;

const View = styled.View`
	flex-direction: column;
	width: 100%;
	flex: 1;
	justify-content: center;
	align-items: center;
	padding-bottom: ${isIphoneSE() ? '20%' : '100px'};
`;

const Title = styled.Text`
	font-size: 26px;
	font-weight: 800;
	padding-left: 6%;
	letter-spacing: 0.6px;
	height: 36px;
	width: 100%;
	align-self: flex-start;
	color: ${props => props.theme.text};
`;

@connect
export default class Settings extends React.Component<Props> {
	render() {
		const {
			biometry,
			watchIsReachable,
			sendTokenToWatch,
			usage,
			darkMode,
			setDarkMode,
		} = this.props.context;

		return (
			<Container>
				<Animatable.View animation="fadeIn" duration={600} style={{ width: '100%' }}>
					{/* $FlowFixMe */}
					<Header />
					<Title>Settings</Title>
					<KeyboardAwareScrollView
						contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
						style={{ width: '100%' }}
						scrollEnabled
					>
						<View>
							{/* $FlowFixMe */}
							<Profile />
							<Separator />
							<SettingsRow>
								<RowText>Dark Mode</RowText>
								<Switch
									onTintColor={
										isAndroid
											? '#bbbbbb'
											: darkMode
												? themes.dark.text
												: themes.light.text
									}
									thumbTintColor={
										darkMode ? themes.dark.background : themes.light.background
									}
									value={darkMode}
									onValueChange={setDarkMode}
								/>
							</SettingsRow>
							<TouchId biometry={biometry} darkMode={darkMode} />
							{(() => {
								if (watchIsReachable) {
									return (
										// $FlowFixMe
										<React.Fragment>
											<Separator />
											<SettingsRow>
												<RowText>Apple Watch</RowText>
												<TouchableOpacity
													activeOpacity={0.6}
													onPress={sendTokenToWatch}
												>
													<Button>Force Sync</Button>
												</TouchableOpacity>
											</SettingsRow>
										</React.Fragment>
									);
								}

								return null;
							})()}
							<UsageLimits usage={usage} />
						</View>
					</KeyboardAwareScrollView>
					{/* $FlowFixMe */}
					<Dropdown />
				</Animatable.View>
			</Container>
		);
	}
}
