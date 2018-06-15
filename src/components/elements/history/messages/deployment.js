// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Deployment extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				deployed <Bold>{event.payload.name}</Bold> to <Bold>{event.payload.url}</Bold>
			</Text>
		);
	}
}
