// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Team extends Message {
	render() {
		const { event, team } = this.props;
		const teamSlug = event.payload.slug;

		if (teamSlug === team.slug) {
			return (
				<Text>
					{this.getDisplayName()}
					created <Bold>this team</Bold>
				</Text>
			);
		}

		return (
			<Text>
				{this.getDisplayName()}
				created the team <Bold>{event.payload.slug}</Bold>
			</Text>
		);
	}
}
