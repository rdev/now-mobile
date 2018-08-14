// @flow
import React from 'react';
import { TouchableWithoutFeedback, AlertIOS } from 'react-native';
import { withNavigation } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components';
import Triangle from 'react-native-triangle';
// $FlowFixMe
import Prompt from 'react-native-prompt-android'; // eslint-disable-line import/no-unresolved, import/extensions
import api from '../lib/api';
import { isAndroid } from '../lib/utils';
import { connect } from '../Provider';
import DropdownRow from './elements/DropdownRow';

type Props = {
	context: any | Context,
	navigation: any | Navigation,
};

type State = {
	visible: boolean,
};

const CancelArea = styled.View`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	flex: 1;
	background-color: transparent;
`;

const Container = styled.View`
	position: absolute;
	top: ${isAndroid === 'android' ? '64px' : '86px'};
	right: 10px;
	width: 65%;
	background-color: white;
	border-radius: 7px;
	shadow-opacity: 0.19;
	shadow-radius: 20px;
	shadow-color: black;
	shadow-offset: 8px 4px;
	elevation: 5;
	border: 0;
`;

const DropdownContainer = Animatable.createAnimatableComponent(Container);

const DropdownContent = styled.View`
	width: 100%;
	height: 100%;
	flex-direction: column;
`;

@connect
@withNavigation
export default class Dropdown extends React.Component<Props, State> {
	state = {
		visible: this.props.context.dropdownVisible,
	};

	componentDidUpdate = async (prevProps: Props) => {
		if (prevProps.context.dropdownVisible && !this.props.context.dropdownVisible) {
			await this.container.fadeOut(300);
			this.setState({ visible: false });
		} else if (!prevProps.context.dropdownVisible && this.props.context.dropdownVisible) {
			this.setState({ visible: true });
		}
	};

	onOutsideTap = () => {
		const { toggleDropdown } = this.props.context;

		const time = new Date().getTime();
		const delta = time - this.lastPress;

		const DOUBLE_PRESS_DELAY = 300;
		// If user taps on the invisible overlay while we're animating the dropdown out, it's gonna mess
		// with componentDidUpdate implementation. So if they tap too fast, abort mission
		if (delta > DOUBLE_PRESS_DELAY) {
			toggleDropdown();
		}

		this.lastPress = time;
	};

	container: Animatable.View;

	lastPress = 0;

	logout = async () => {
		await this.props.context.logOut();
		this.props.navigation.replace('Authentication');
	};

	createTeam = (error?: string) => {
		const handler = isAndroid ? Prompt : AlertIOS.prompt;
		handler('Enter new team name', error, [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{
				text: 'Create',
				onPress: async (slug) => {
					try {
						await this.props.context.createTeam(slug);
					} catch (e) {
						console.log('TEAM CREATION ERROR', e);
						if (e.code === 'slug_in_use_team') {
							this.createTeam(`The name "${slug}" is already in use`);
						} else {
							this.createTeam('There was an error creating a team');
						}
					}
				},
			},
		]);
	};

	switchTeam = (team?: string) => {
		const { setTeam, toggleDropdown, setUpdateMessage } = this.props.context;

		setTeam(team);
		toggleDropdown();
		setUpdateMessage('Team context updated!');
	};

	render() {
		const { user, teams, team } = this.props.context;

		return this.state.visible ? (
			// $FlowFixMe
			<React.Fragment>
				<TouchableWithoutFeedback style={{ flex: 1 }} onPress={this.onOutsideTap}>
					<CancelArea />
				</TouchableWithoutFeedback>
				<DropdownContainer
					animation="fadeIn"
					duration={300}
					ref={(ref) => {
						this.container = ref;
					}}
				>
					<Triangle
						width={36}
						height={16}
						color="white"
						direction="up"
						style={{ position: 'absolute', right: 12, top: -16 }}
					/>
					<DropdownContent>
						<DropdownRow
							text="Create a team"
							plus
							padded
							border="bottom"
							onPress={() => this.createTeam()}
						/>
						<DropdownRow text="Profiles" bold />
						<DropdownRow
							text={user.username}
							image={user.avatar ? api.user.avatarPath(user.avatar) : 'gradient'}
							active={!team}
							onPress={() => this.switchTeam(null)}
						/>
						{teams.map(t => (
							<DropdownRow
								text={t.name}
								image={t.avatar ? api.user.avatarPath(t.avatar) : 'gradient'}
								key={t.id}
								// $FlowFixMe this is weird
								active={team && team.id === t.id}
								onPress={() => this.switchTeam(t)}
							/>
						))}
						<DropdownRow text="Logout" border="top" onPress={this.logout} padded />
					</DropdownContent>
				</DropdownContainer>
			</React.Fragment>
		) : null;
	}
}
