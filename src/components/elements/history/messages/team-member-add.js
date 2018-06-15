// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class TeamMemberAdd extends Message {
	render() {
		const { event } = this.props;
		const { invitedUser } = event.payload;
		const username = invitedUser.username || invitedUser.email;

		return (
			<Text>
				{this.getDisplayName()}
				invited user{invitedUser.username ? '' : ' with email address'}{' '}
				<Bold>{username}</Bold>
			</Text>
		);
	}
}
