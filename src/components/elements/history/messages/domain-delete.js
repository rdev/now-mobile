// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class DomainDelete extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				removed domain <Bold>{event.payload.name}</Bold>
			</Text>
		);
	}
}
