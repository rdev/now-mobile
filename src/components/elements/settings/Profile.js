// @flow
import React from 'react';
import { TouchableOpacity, Alert, Image } from 'react-native';
import styled from 'styled-components';
import { connect } from '../../../Provider';
import { isAndroid } from '../../../lib/utils';
import api from '../../../lib/api';
import gradient from '../../../../assets/gradient.jpg';
import Input from './Input';
import Button from './Button';
import ProfilePic from './ProfilePic';

type Props = {
	context: Context,
};

type State = {
	editing: boolean,
	inputValue: string,
};


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

const Email = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: ${props => props.theme.dimmedText};
	margin-top: 15px;
`;

@connect
class Profile extends React.Component<Props, State> {
	state = {
		editing: false,
		inputValue: this.props.context.user.username,
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

	render() {
		const {
			user,
			team,
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
			<React.Fragment>
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
			</React.Fragment>
		);
	}
}

export default Profile;
