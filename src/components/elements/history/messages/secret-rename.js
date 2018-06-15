// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class SecretRename extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				renamed secret <Bold>{event.payload.oldName}</Bold> to{' '}
				<Bold>{event.payload.newName}</Bold>
			</Text>
		);
	}
}
