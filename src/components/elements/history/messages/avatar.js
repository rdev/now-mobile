// @flow
import React from 'react';
import { Text } from '../ItemComponents';
import Message from './message';

export default class Avatar extends Message {
	render() {
		return (
			<Text>
				{this.getDisplayName()}
				updated your avatar
			</Text>
		);
	}
}
