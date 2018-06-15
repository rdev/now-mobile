// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class DomainBuy extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				bought the domain <Bold>{event.payload.name}</Bold> for ${event.payload.price} (per
				year)
			</Text>
		);
	}
}
