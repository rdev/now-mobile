// @flow
import React, { Component } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { CachedImage } from 'react-native-img-cache';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components';
import api from '../lib/api';
import { platformBlackColor } from '../lib/utils';
import { connect } from '../Provider';
import gradient from '../../assets/gradient.jpg';
import Logo from './Logo';

type Props = {
	context: any | Context,
	navigation?: Navigation,
};

const { height, width } = Dimensions.get('window');
const isPad = height / width < 1.6;

const View = styled.View`
	width: 100%;
	padding-horizontal: 5%;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 70px;
	margin-bottom: ${isPad ? '0' : '30px'};
`;

const MessageContainer = View.extend`
	justify-content: center;
`;

const Message = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${platformBlackColor};
`;

const ProfilePic = styled.View`
	height: 40px;
	width: 40px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
`;

@withNavigation
@connect
export default class Header extends Component<Props> {
	toggleSettings = () => {
		// $FlowFixMe
		if (this.props.navigation.state.routeName === 'Settings') {
			// $FlowFixMe
			this.props.navigation.replace('Main');
		} else {
			// $FlowFixMe
			this.props.navigation.replace('Settings');
		}
	};

	profileDropdown = () => {};

	render() {
		const { user, team, updateMessage } = this.props.context;
		let avatar;
		if (team) {
			avatar = team.avatar || null;
		} else {
			avatar = user.avatar || user.uid;
		}

		if (updateMessage !== '') {
			return (
				<MessageContainer>
					<Animatable.View animation="fadeOut" delay={550} duration={300}>
						<Message>{updateMessage}</Message>
					</Animatable.View>
				</MessageContainer>
			);
		}

		return (
			<View>
				<TouchableOpacity activeOpacity={0.7} onPress={this.toggleSettings}>
					<Logo />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.7} onPress={this.props.context.toggleDropdown}>
					<ProfilePic>
						<CachedImage
							source={
								avatar
									? {
										uri: api.user.avatarPath(team && team.avatar ? team.avatar : user.avatar),
										cache: 'force-cache',
									  }
									: gradient
							}
							style={{ width: '100%', height: '100%' }}
						/>
					</ProfilePic>
				</TouchableOpacity>
			</View>
		);
	}
}
