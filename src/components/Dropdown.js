import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components';
import Triangle from 'react-native-triangle';
import api from '../lib/api';
import { connect } from '../Provider';
import DropdownRow from './elements/DropdownRow';

const sleep = s => new Promise(resolve => setTimeout(resolve, s * 1000));

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
	top: 86px;
	right: 10px;
	width: 65%;
	background-color: white;
	border-radius: 7px;
	shadow-opacity: 0.19;
	shadow-radius: 20px;
	shadow-color: black;
	shadow-offset: 8px 4px;
`;

const DropdownContainer = Animatable.createAnimatableComponent(Container);

const DropdownContent = styled.View`
	width: 100%;
	height: 100%;
	flex-direction: column;
`;

@connect
@withNavigation
export default class Dropdown extends React.Component {
	state = {
		visible: this.props.context.dropdownVisible,
	};

	componentDidUpdate = async (prevProps) => {
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

	lastPress = 0;

	logout = async () => {
		await this.props.context.logOut();
		this.props.navigation.replace('Authentication');
	};

	render() {
		const { user } = this.props.context;

		return this.state.visible ? (
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
						<DropdownRow text="Create a team" plus padded border="bottom" />
						<DropdownRow text="Profiles" bold />
						<DropdownRow
							text={user.username}
							image={api.user.avatarPath(user.avatar)}
							active
						/>
						<DropdownRow text="Logout" border="top" onPress={this.logout} padded />
					</DropdownContent>
				</DropdownContainer>
			</React.Fragment>
		) : null;
	}
}
