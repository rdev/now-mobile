import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import api from '../lib/api';
import Logo from './Logo';

const View = styled.View`
	width: 100%;
	padding-horizontal: 5%;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 70px;
	margin-bottom: 30px;
`;

const ProfilePic = styled.View`
	height: 40px;
	width: 40px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
`;

export default class Header extends Component {
	state = { user: {} };
	componentDidMount = async () => {
		const { user } = await api.user.vitals();
		console.log(user);
		this.setState({ user });
	}

	toggleSettings = () => {}

	profileDropdown = () => {}

	render() {
		const { avatar } = this.state.user;
		return (
			<View>
				<TouchableOpacity activeOpacity={0.7}>
					<Logo />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.7}>
					<ProfilePic>
						<Image source={{ uri: api.user.avatarPath(avatar) }} style={{ width: '100%', height: '100%' }} />
					</ProfilePic>
				</TouchableOpacity>
			</View>
		);
	}
}
