// @flow
import React from 'react';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

// @FIXME API changed by Zeit: event.payload.alias / event.payload.deploymentUrl gone

export default class Alias extends Message {
	render() {
		const { event } = this.props;
		const { ruleCount } = event.payload;

		// NOTE: no `ruleCount` on old logs
		if ((ruleCount !== null && ruleCount > 0) || !event.payload.deploymentUrl) {
			return (
				<Text>
					{this.getDisplayName()}
					configured {event.payload.ruleCount} alias rule
					{event.payload.ruleCount === null || event.payload.ruleCount > 1
						? 's'
						: ''} for <Bold>{event.payload.alias}</Bold>
				</Text>
			);
		}

		return (
			<Text>
				{this.getDisplayName()}
				aliased <Bold>{event.payload.deploymentUrl}</Bold> to{' '}
				<Bold>{event.payload.alias}</Bold>
			</Text>
		);
	}
}
