// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class SecretDelete extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				removed secret{' '}
				<Bold>{event.payload.name ? event.payload.name : event.payload.uid}</Bold>
			</Text>
		);
	}
}
