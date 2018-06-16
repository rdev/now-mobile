// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class TeamMemberRoleUpdate extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				updated <Bold>{event.payload.updatedUser.username}</Bold>
				{"'"}s role from <Bold>{event.payload.previousRole}</Bold> to{' '}
				<Bold>{event.payload.role}</Bold>
			</Text>
		);
	}
}
