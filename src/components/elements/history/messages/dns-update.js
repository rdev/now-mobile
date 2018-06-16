// @flow
import React from 'react';
import styled from 'styled-components';
import { Text, Bold, Monospace, MonospaceWrap } from '../ItemComponents';
import Message from './message';

const View = styled.View`
	flex-direction: column;
`;

export default class DnsUpdate extends Message {
	render() {
		const { event } = this.props;
		const { value } = event.payload;
		const v = value.slice(0, 50);

		return (
			<View>
				<Text>
					{this.getDisplayName()}
					updated a DNS record for <Bold>{event.payload.domain}</Bold>:
				</Text>
				<MonospaceWrap>
					<Monospace>
						{event.payload.id ? `${event.payload.id}:` : ''} {event.payload.name}{' '}
						{event.payload.type} {v + (v.length < value.length ? '…' : '')}
					</Monospace>
				</MonospaceWrap>
			</View>
		);
	}
}
