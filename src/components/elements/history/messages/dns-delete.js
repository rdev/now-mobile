// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class DnsDelete extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				removed a DNS record {event.payload.id} of <Bold>{event.payload.domain}</Bold>
			</Text>
		);
	}
}
