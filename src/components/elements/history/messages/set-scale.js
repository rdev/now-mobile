// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Scale extends Message {
	render() {
		const { event } = this.props;
		const { min, max } = event.payload;

		if (min && max) {
			return (
				<Text>
					{this.getDisplayName()}
					updated scale rules for <Bold>{event.payload.url}</Bold> to min:{' '}
					<Bold>{min}</Bold>, max: <Bold>{max}</Bold>
				</Text>
			);
		}

		return (
			<Text>
				{this.getDisplayName()}
				updated scale rules for <Bold>{event.payload.url}</Bold>
			</Text>
		);
	}
}
