// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class CertClone extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				cloned a certificate <Bold>{event.payload.src}</Bold> to{' '}
				<Bold>{event.payload.dst}</Bold>
			</Text>
		);
	}
}
