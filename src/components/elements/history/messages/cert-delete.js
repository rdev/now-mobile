// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class CertDelete extends Message {
	render() {
		const { event } = this.props;
		const { recordId } = event.payload;

		return (
			<Text>
				{this.getDisplayName()}
				deleted certificate <Bold>{recordId}</Bold>
			</Text>
		);
	}
}
