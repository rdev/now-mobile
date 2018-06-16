import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import api from '../../../lib/api';
import messageComponents from './messages';

const View = styled.View`
	width: 100%;
	flex-direction: row;
	align-items: center;
	padding-vertical: 15px;
	${({ last }) => {
		if (last) {
			return '';
		}
		return `
			border-bottom-width: 1px;
			border-bottom-color: #EAEAEA;
		`;
	}};
`;

const UserPic = styled.View`
	height: 40px;
	width: 40px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
	margin-right: 10px;
	align-self: baseline;
`;

const MessageWrap = styled.View`
	padding-right: 10px;
	flex: 1;
`;

export default ({ user, event, team }) => {
	const Component = messageComponents.get(event.type);

	return (
		<View>
			<UserPic>
				<Image
					source={{ uri: api.user.avatarPath(user.uid) }}
					style={{ width: '100%', height: '100%' }}
				/>
			</UserPic>
			<MessageWrap>
				<Component event={event} user={user} team={team} />
			</MessageWrap>
			<TimeAgo date={event.created} style={{ marginLeft: 10 }} />
		</View>
	);
};
