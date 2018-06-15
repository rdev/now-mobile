// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class TeamDelete extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				deleted the team <Bold>{event.payload.slug}</Bold>
			</Text>
		);
	}
}
