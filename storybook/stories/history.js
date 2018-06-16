import React from 'react';
import { storiesOf } from '@storybook/react-native';
import messageComponents from '../../src/components/elements/history/messages';
import HistoryItem from '../../src/components/elements/history/HistoryItem';
import center from './_center';

const toTitle = str =>
	str.toLowerCase().replace(/(?:^|[\s-/])\w/g, match => match.replace(/-/g, '').toUpperCase());

const MessageStories = storiesOf('Message', module).addDecorator(center);

const user = {
	uid: 'abc',
	username: 'rdev',
};

const team = { slug: 'zeit-slug' };

const event = {
	type: 'deployment',
	payload: {
		deploymentUrl: 'zeit-zvasdfasdf.now.sh',
		url: 'zeit-zvasdfasdf.now.sh',
		ruleCount: 1,
		alias: 'zeit.co',
		name: 'zeit.co',
		oldTeam: { name: 'Old Team' },
		newTeam: { name: 'New Team' },
		id: 'abc-1234567890',
		recordId: 'abc-1234567890',
		src: 'src-1234567890',
		dst: 'dst-1234567890',
		cn: 'zeit.co',
		domain: 'zeit.co',
		type: 'CNAME',
		value: 'alias.zeit.co',
		price: 15,
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3462.0 Safari/537.36',
		plan: 'Premium',
		instances: 2,
		min: 0,
		max: 3,
		slug: 'zeit-slug',
		invitedUser: {
			name: 'Max',
			email: 'hey@fivepointseven.com',
		},
		deletedUser: {
			name: 'Max',
			email: 'hey@fivepointseven.com',
		},
		updatedUser: {
			name: 'Max',
			email: 'hey@fivepointseven.com',
		},
		previousRole: 'Previous Role',
		role: 'New Role',
		username: 'rdev',
		oldName: 'old-name',
		newName: 'new-name',
	},
	user,
};

messageComponents.forEach((Component, key) => {
	MessageStories.add(toTitle(key), () => <Component event={event} user={user} team={team} />);
});

const HistoryItemStories = storiesOf('HistoryItem', module).addDecorator(center);

HistoryItemStories.add('Default', () => <HistoryItem user={user} event={event} team={team} />);

HistoryItemStories.add('Borderless', () => (
	<HistoryItem user={user} event={{ ...event, type: 'alias' }} team={team} last />
));
