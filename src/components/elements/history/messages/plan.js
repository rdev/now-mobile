// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Plan extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				changed plan to <Bold>{event.payload.plan}</Bold>
			</Text>
		);
	}
}
