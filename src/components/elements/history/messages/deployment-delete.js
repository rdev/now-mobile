// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class DeploymentDelete extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				deleted <Bold>{event.payload.url}</Bold>
			</Text>
		);
	}
}
