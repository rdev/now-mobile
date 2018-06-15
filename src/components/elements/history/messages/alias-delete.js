// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class AliasDelete extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				removed alias <Bold>{event.payload.alias}</Bold>
			</Text>
		);
	}
}
