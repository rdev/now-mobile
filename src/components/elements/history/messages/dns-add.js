// @flow
import React from 'react';
import { Text, Bold, Monospace, MonospaceWrap } from '../ItemComponents';
import Message from './message';

export default class DnsAdd extends Message {
	render() {
		const { event } = this.props;
		const { value } = event.payload;
		const v = value.slice(0, 50);

		return (
			<Text>
				{this.getDisplayName()}
				added a DNS record for <Bold>{event.payload.domain}</Bold>:{' '}
				<MonospaceWrap>
					<Monospace>
						{event.payload.id || ''}
						: {event.payload.name} {event.payload.type}{' '}
						{v + (v.length < value.length ? '…' : '')}
					</Monospace>
				</MonospaceWrap>
			</Text>
		);
	}
}
