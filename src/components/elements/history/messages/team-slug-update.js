// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class TeamSlugUpdate extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				updated team url to <Bold>{event.payload.slug}</Bold>
			</Text>
		);
	}
}
