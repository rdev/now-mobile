// @TODO This component is getting too huge for comfort
// @flow
import React from 'react';
import {
	SafeAreaView,
	TouchableOpacity,
	Switch,
	AsyncStorage,
} from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';
import Dropdown from '../components/Dropdown';
import UsageLimitInput from '../components/elements/settings/UsageLimitInput';
import Separator from '../components/elements/settings/Separator';
import SettingsRow from '../components/elements/settings/SettingsRow';
import RowText from '../components/elements/settings/RowText';
import Button from '../components/elements/settings/Button';
import Profile from '../components/elements/settings/Profile';
import TouchId from '../components/elements/settings/TouchId';
import { isIphoneSE, isAndroid, themes } from '../lib/utils';
import { connect } from '../Provider';

type Props = {
	context: Context,
};

type State = {
	instanceLimit: string,
	bandwidthLimit: string,
	logsLimit: string,
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


const SectionHeading = styled.Text`
	font-size: 18px
	font-weight: 700;
	color: ${props => props.theme.text};
	width: 80%;
	margin-bottom: 15px;
`;

@connect
export default class Settings extends React.Component<Props, State> {
	state = {
		instanceLimit: '0',
		bandwidthLimit: '0',
		logsLimit: '0',
	};

	componentDidMount = () => {
		this.getUsageLimits();
	};

	getUsageLimits = async () => {
		const instanceLimit =
			(await AsyncStorage.getItem('@now:instanceLimit')) || this.state.instanceLimit;
		const bandwidthLimit =
			(await AsyncStorage.getItem('@now:bandwidthLimit')) || this.state.bandwidthLimit;
		const logsLimit = (await AsyncStorage.getItem('@now:logsLimit')) || this.state.logsLimit;

		this.setState({
			instanceLimit,
			bandwidthLimit,
			logsLimit,
		});
	};

	setLimit = async (value: string, type: 'instanceLimit' | 'bandwidthLimit' | 'logsLimit') => {
		let limit = value.replace(/\D/g, '');
		if (limit.length > 0 && limit.substr(0, 1) === '0') {
			limit = limit.slice(1);
		}
		if (limit === '') {
			limit = '0';
		}

		await AsyncStorage.setItem(`@now:${type}`, limit);
		this.setState({ [type]: limit });
	};

	render() {
		const {
			biometry,
			watchIsReachable,
			sendTokenToWatch,
			usage,
			team,
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
							{(() => {
								if (usage.mode === 'on-demand' || usage.mode === 'unlimited') {
									return (
										// $FlowFixMe
										<React.Fragment>
											<Separator />
											<SectionHeading>Usage limits</SectionHeading>
											<SettingsRow>
												<RowText>Instances</RowText>
												<UsageLimitInput
													value={this.state.instanceLimit}
													onChangeText={(val: string) => {
														this.setLimit(val, 'instanceLimit');
													}}
												/>
											</SettingsRow>
											<SettingsRow>
												<RowText>Bandwidth</RowText>
												<UsageLimitInput
													value={this.state.bandwidthLimit}
													onChangeText={(val: string) => {
														this.setLimit(val, 'bandwidthLimit');
													}}
													label
												/>
											</SettingsRow>
											<SettingsRow style={{ height: 40 }}>
												<RowText>Logs</RowText>
												<UsageLimitInput
													value={this.state.logsLimit}
													onChangeText={(val: string) => {
														this.setLimit(val, 'logsLimit');
													}}
													label
												/>
											</SettingsRow>
										</React.Fragment>
									);
								}
								return null;
							})()}
						</View>
					</KeyboardAwareScrollView>
					{/* $FlowFixMe */}
					<Dropdown />
				</Animatable.View>
			</Container>
		);
	}
}
