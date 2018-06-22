// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class CertAutoRenew extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				Certificate for <Bold>{event.payload.cn}</Bold> was automatically renewed
			</Text>
		);
	}
}
