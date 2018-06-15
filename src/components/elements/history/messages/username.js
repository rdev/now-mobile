// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Username extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				set username to <Bold>{event.payload.username}</Bold>
			</Text>
		);
	}
}
