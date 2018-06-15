// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Scale extends Message {
	render() {
		const { event } = this.props;
		const { instances } = event.payload;

		return (
			<Text>
				{this.getDisplayName()}
				scaled deployment <Bold>{event.payload.url}</Bold> to{' '}
				<Bold>
					{instances} instance{instances > 1 ? 's' : ''}
				</Bold>
			</Text>
		);
	}
}
