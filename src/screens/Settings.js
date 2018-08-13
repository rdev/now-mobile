// @TODO This component is getting too huge for comfort
// @flow
import React from 'react';
import { SafeAreaView, Image, TouchableOpacity, Switch, AsyncStorage, Alert } from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';
import Dropdown from '../components/Dropdown';
import Input from '../components/elements/settings/Input';
import UsageLimitInput from '../components/elements/settings/UsageLimitInput';
import api from '../lib/api';
import touchIdPrompt from '../lib/touch-id-prompt';
import { isIphoneSE, platformBlackColor, isAndroid } from '../lib/utils';
import { connect } from '../Provider';

type Props = {
	context: Context,
};

type State = {
	editing: boolean,
	touchId: boolean,
	inputValue: string,
	instanceLimit: string,
	bandwidthLimit: string,
	logsLimit: string,
};

const Container = styled(SafeAreaView)`
	width: 100%;
	flex: 1;
	flex-direction: column;
	background-color: white;
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
	color: ${platformBlackColor};
`;

export const ProfilePic = styled.View`
	height: 128px;
	width: 128px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
	margin-bottom: 30px;
	margin-top: ${isIphoneSE() ? '0px' : '100px'};
`;

const ProfileInfo = styled.View`
	flex-direction: column;
	align-items: center;
	height: 56px;
	width: 100%;
	margin-bottom: 30px;
`;

const ProfileMeta = styled.View`
	flex-direction: row;
	height: 28px;
	align-items: center;
`;

const ButtonGroup = styled.View`
	flex-direction: row;
	justify-content: space-between;
	width: 40%;
	margin-top: 15px;
`;

const ProfileName = styled.Text`
	font-size: 18px;
	font-weight: 700;
	letter-spacing: 0.2px;
	color: ${platformBlackColor};
	margin-right: 5px;
`;

const Text = styled.Text`
	font-size: 18px;
	font-weight: 300;
	letter-spacing: 0.2px;
	color: ${platformBlackColor};
`;

export const Button = styled.Text`
	font-size: 18px;
	font-weight: 300;
	color: #067df7;
`;

const Email = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: #b5b5b5;
	margin-top: 15px;
`;

const Separator = styled.View`
	height: 1px;
	border-bottom-color: #eaeaea;
	border-bottom-width: 1px;
	margin-vertical: 12px;
	width: 80%;
`;

const SettingsRow = styled.View`
	width: 80%;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-vertical: 5px;
`;

const RowText = styled.Text`
	font-size: 18px
	font-weight: 400;
	color: ${platformBlackColor};
`;

const SectionHeading = styled.Text`
	font-size: 18px
	font-weight: 700;
	color: ${platformBlackColor};
	width: 80%;
	margin-bottom: 15px;
`;

@connect
export default class Settings extends React.Component<Props, State> {
	state = {
		editing: false,
		inputValue: this.props.context.user.username,
		touchId: false,
		instanceLimit: '0',
		bandwidthLimit: '0',
		logsLimit: '0',
	};

	static getDerivedStateFromProps = (nextProps: object, prevState: object) => {
		const { mode, user, team } = nextProps.context;
		const { inputValue } = prevState;
		const isUser = mode === 'me';

		if (isUser && inputValue !== user.username) {
			return {
				inputValue: user.username,
			};
		} else if (!isUser && inputValue !== team.name) {
			return {
				inputValue: team.name,
			};
		}

		return null;
	};

	componentDidMount = () => {
		this.setTouchId();
		this.getUsageLimits();
	};

	toggleEditing = () => {
		this.setState({ editing: !this.state.editing });
	};

	handleInput = (inputValue: string) => {
		this.setState({ inputValue });
	};

	handleNameChange = (message: string) => {
		const {
			mode, refreshUserInfo, refreshTeamInfo, team,
		} = this.props.context;

		if (message) {
			// This one doesn't have an "error" field
			Alert.alert('Error', message, [{ text: 'Dismiss' }]);
		} else if (mode === 'me') {
			refreshUserInfo();
		} else {
			refreshTeamInfo(team.id);
		}

		this.toggleEditing();
	};

	changeUsername = async () => {
		const result = await api.user.changeUsername(this.state.inputValue);

		this.handleNameChange(result.message);
	};

	changeTeamName = async () => {
		const { team } = this.props.context;
		const result = await api.teams.changeTeamName(team.id, this.state.inputValue);

		this.handleNameChange(result.message);
	};

	setTouchId = async () => {
		const touchIdEnabled = await AsyncStorage.getItem('@now:touchId');
		if (touchIdEnabled) {
			this.setState({ touchId: true });
		}
	};

	toggleTouchId = async (active: boolean) => {
		const { biometry } = this.props.context;

		if (active && biometry !== undefined) {
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
			mode,
			user,
			team,
		} = this.props.context;
		const changeName = mode === 'me' ? this.changeUsername : this.changeTeamName;
		const current =
			mode === 'me'
				? {
					avatar: user.avatar || user.uid,
					name: user.username,
				  }
				: {
					avatar: team.avatar || team.id,
					name: team.name,
				  };

		return (
			<Container>
				<Animatable.View animation="fadeIn" duration={600} style={{ width: '100%' }}>
					{/* $FlowFixMe */}
					<Header />
					<Title>Settings</Title>
					<KeyboardAwareScrollView
						contentContainerStyle={{
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
						}}
						style={{
							width: '100%',
						}}
						scrollEnabled
					>
						<View>
							<ProfilePic>
								<Image
									source={{
										uri: api.user.avatarPath(current.avatar),
										cache: 'force-cache',
									}}
									style={{ width: '100%', height: '100%' }}
								/>
							</ProfilePic>
							<ProfileInfo>
								{(() => {
									if (this.state.editing) {
										return (
											// $FlowFixMe
											<React.Fragment>
												<Input
													onChangeText={this.handleInput}
													value={this.state.inputValue}
												/>
												<ButtonGroup>
													<TouchableOpacity
														activeOpacity={0.65}
														onPress={changeName}
													>
														<Button>save</Button>
													</TouchableOpacity>
													<TouchableOpacity
														activeOpacity={0.65}
														onPress={this.toggleEditing}
													>
														<Button>cancel</Button>
													</TouchableOpacity>
												</ButtonGroup>
											</React.Fragment>
										);
									}
									// @TODO Team editing
									return (
										// $FlowFixMe
										<React.Fragment>
											<ProfileMeta>
												<ProfileName>{`${current.name}`}</ProfileName>
												{/* We can't have anything except text inside <Text> on Android, sooo */}
												<Text>(</Text>
												<TouchableOpacity
													activeOpacity={0.65}
													style={{ height: 20 }}
													onPress={this.toggleEditing}
												>
													<Button
														style={isAndroid ? { marginTop: -3 } : {}}
													>
														change
													</Button>
												</TouchableOpacity>
												<Text>)</Text>
											</ProfileMeta>
											<Email>{user.email}</Email>
										</React.Fragment>
									);
								})()}
							</ProfileInfo>
							{(() => {
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
													onTintColor={isAndroid ? '#bbbbbb' : '#000000'}
													thumbTintColor={isAndroid ? '#000000' : null}
													value={this.state.touchId}
													onValueChange={this.toggleTouchId}
												/>
											</SettingsRow>
										</React.Fragment>
									);
								}

								return null;
							})()}
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
