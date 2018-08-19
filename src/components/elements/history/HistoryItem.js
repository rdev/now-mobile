// @flow
import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components';
import { CachedImage } from 'react-native-img-cache';
import TimeAgo from '../TimeAgo';
import api from '../../../lib/api';
import NowLogo from '../../../../assets/now-white.png';
import messageComponents from './messages';

type Props = {
	user: Zeit$User,
	event: Zeit$Event,
	team: any, // Zeit$Team,
};

const systemEvents = new Set([
	'scale',
	'scale-auto',
	'deployment-freeze',
	'deployment-unfreeze',
	'cert-autorenew',
]);

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

export default class HistoryItem extends React.PureComponent<Props> {
	render() {
		const { user, event, team } = this.props;
		const Component = messageComponents.get(event.type);

		return (
			<View>
				<UserPic>
					{systemEvents.has(event.type) ? (
						<Image source={NowLogo} style={{ width: '100%', height: '100%' }} />
					) : (
						<CachedImage
							// @TODO handle empty avatars
							source={{
								uri: api.user.avatarPath(event.user ? event.user.uid : event.userId),
							}}
							style={{ width: '100%', height: '100%' }}
						/>
					)}
				</UserPic>
				<MessageWrap>
					<Component event={event} user={user} team={team || {}} />
				</MessageWrap>
				<TimeAgo date={event.created} style={{ marginLeft: 10 }} />
			</View>
		);
	}
}
