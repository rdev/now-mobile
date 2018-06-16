// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

export default class CertChown extends Message {
	render() {
		const { event } = this.props;

		return (
			<Text>
				{this.getDisplayName()}
				changed the ownership of cert <Bold>{event.payload.id}</Bold>
				{event.payload.oldTeam ? ` from ${event.payload.oldTeam.name}` : ''} to{' '}
				{event.payload.newTeam.name}
			</Text>
		);
	}
}
