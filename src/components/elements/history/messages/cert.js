// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class Cert extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				created a certificate for <Bold>{event.payload.cn}</Bold>
			</Text>
		);
	}
}
