// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class DeploymentFreeze extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				The deployment <Bold>{event.payload.url}</Bold> was frozen
			</Text>
		);
	}
}
