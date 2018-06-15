// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class TeamNameUpdate extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				updated team name to <Bold>{event.payload.name}</Bold>
			</Text>
		);
	}
}
