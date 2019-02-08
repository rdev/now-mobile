// @TODO This component is getting too huge for comfort
// @flow
import React from 'react';
import {
	SafeAreaView,
	Image,
	TouchableOpacity,
	Switch,
	AsyncStorage,
	Alert,
	ActionSheetIOS,
} from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';
import Dropdown from '../components/Dropdown';
import Input from '../components/elements/settings/Input';
import UsageLimitInput from '../components/elements/settings/UsageLimitInput';
import Separator from '../components/elements/settings/Separator';
import SettingsRow from '../components/elements/settings/SettingsRow';
import RowText from '../components/elements/settings/RowText';
import TouchId from '../components/elements/settings/TouchId';
import api from '../lib/api';
import { isIphoneSE, isAndroid, themes } from '../lib/utils';
import { connect } from '../Provider';
import gradient from '../../assets/gradient.jpg';

type Props = {
	context: Context,
};

type State = {
	editing: boolean,
	inputValue: string,
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

export const ProfilePic = styled.View`
	height: 128px;
	width: 128px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
	margin-bottom: 30px;
	margin-top: ${isIphoneSE() ? '60px' : '120px'};
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
	color: ${props => props.theme.text};
	margin-right: 5px;
`;

const Text = styled.Text`
	font-size: 18px;
	font-weight: 300;
	letter-spacing: 0.2px;
	color: ${props => props.theme.text};
`;

export const Button = styled.Text`
	font-size: 18px;
	font-weight: 300;
	color: ${props => props.theme.settingsButton};
`;

const Email = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: ${props => props.theme.dimmedText};
	margin-top: 15px;
`;

const SectionHeading = styled.Text`
	font-size: 18px
	font-weight: 700;
	color: ${props => props.theme.text};
	width: 80%;
	margin-bottom: 15px;
`;

const DeleteText = styled.Text`
	color: ${props => props.theme.deploymentErrorText};
`;

@connect
export default class Settings extends React.Component<Props, State> {
	state = {
		editing: false,
		inputValue: this.props.context.user.username,
		instanceLimit: '0',
		bandwidthLimit: '0',
		logsLimit: '0',
	};

	static getDerivedStateFromProps = (nextProps: Props, prevState: State) => {
		const { user, team } = nextProps.context;
		const { inputValue } = prevState;

		if (!team && inputValue !== user.username) {
			// If user
			return {
				inputValue: user.username,
			};
		} else if (team && inputValue !== team.name) {
			// If team
			return {
				inputValue: team.name,
			};
		}

		return null;
	};

	componentDidMount = () => {
		this.getUsageLimits();
	};

	toggleEditing = () => {
		this.setState({ editing: !this.state.editing });
	};

	handleInput = (inputValue: string) => {
		this.setState({ inputValue });
	};

	handleNameChange = (message: string) => {
		const { refreshUserInfo, refreshTeamInfo, team } = this.props.context;

		if (message) {
			// This one doesn't have an "error" field
			Alert.alert('Error', message, [{ text: 'Dismiss' }]);
		} else if (team) {
			refreshTeamInfo(team.id);
		} else {
			refreshUserInfo();
		}

		this.toggleEditing();
	};

	changeUsername = async () => {
		const result = await api.user.changeUsername(this.state.inputValue);

		this.handleNameChange(result.message);
	};

	changeTeamName = async () => {
		const { team } = this.props.context;
		if (!team) return;

		const result = await api.teams.changeTeamName(team.id, this.state.inputValue);

		this.handleNameChange(result.message);
	};

	deleteTeam = async () => {
		const message = 'Are you sure you want delete this team?';
		const { deleteTeam, team } = this.props.context;

		if (!team) return;

		if (isAndroid) {
			Alert.alert(
				message,
				null,
				[
					{ text: 'Cancel', onPress: () => {} },
					{
						text: 'Delete',
						onPress: async () => {
							await deleteTeam(team.id);
						},
					},
				],
				{ cancelable: false },
			);
		} else {
			ActionSheetIOS.showActionSheetWithOptions(
				{
					title: message,
					options: ['Cancel', 'Delete'],
					destructiveButtonIndex: 1,
					cancelButtonIndex: 0,
				},
				async (buttonIndex): any => {
					if (buttonIndex === 1) {
						await deleteTeam(team.id);
					}
				},
			);
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
			user,
			team,
			darkMode,
			setDarkMode,
		} = this.props.context;
		const changeName = team ? this.changeTeamName : this.changeUsername;
		const current = team
			? {
				avatar: team.avatar || null,
				name: team.name,
			  }
			: {
				avatar: user.avatar || user.uid,
				name: user.username,
			  };

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
							<ProfilePic>
								<Image
									source={
										current.avatar
											? {
												uri: api.user.avatarPath(current.avatar),
												cache: 'force-cache',
											  }
											: gradient
									}
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
											{team ? null : <Email>{user.email}</Email>}
										</React.Fragment>
									);
								})()}
							</ProfileInfo>
							{(() => {
								if (team) {
									return (
										<TouchableOpacity
											activeOpacity={0.65}
											onPress={() => this.deleteTeam()}
										>
											<DeleteText>DELETE TEAM</DeleteText>
										</TouchableOpacity>
									);
								}

								return null;
							})()}
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
