// @flow
import React, { PureComponent } from 'react';
import { Bold } from '../ItemComponents';

type Props = {
	event: any,
	user: Zeit$User,
	team: { slug: string }, // @TODO Zeit$Team,
};

class Message extends PureComponent<Props> {
	getDisplayName() {
		const { event, user } = this.props;

		let isCurrentUser = false;

		if (event.userId && event.userId === user.uid) {
			isCurrentUser = true;
		}

		if (event.user && event.user.uid && event.user.uid === user.uid) {
			isCurrentUser = true;
		}

		if (isCurrentUser) {
			return [<Bold key="you">You</Bold>, ' '];
		}

		if (event.user.username) {
			return [<Bold key="username">{event.user.username}</Bold>, ' '];
		}

		return [<Bold key="username">{event.user.email}</Bold>, ' '];
	}
}

export default Message;
