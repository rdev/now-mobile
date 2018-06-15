// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Scale extends Message {
	render() {
		const { event } = this.props;
		const { instances, url } = event.payload;

		return (
			<Text>
				The deployment <Bold>{url}</Bold> was auto-scaled to{' '}
				<Bold>
					{instances} instance{instances > 1 ? 's' : ''}
				</Bold>
			</Text>
		);
	}
}
