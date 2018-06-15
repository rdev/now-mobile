// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class TeamMemberDelete extends Message {
	render() {
		const { event } = this.props;
		const { deletedUser } = event.payload;
		const username = deletedUser.username || deletedUser.email;

		return (
			<Text>
				{this.getDisplayName()}
				removed user{deletedUser.username ? '' : ' with email address'}{' '}
				<Bold>{username}</Bold>
			</Text>
		);
	}
}
