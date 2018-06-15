// @flow
import React from 'react';
import { Text } from '../ItemComponents';
import Message from './message';

export default class TeamAvatarUpdate extends Message {
	render() {
		return (
			<Text>
				{this.getDisplayName()}
				updated the team{"'"}s avatar
			</Text>
		);
	}
}
