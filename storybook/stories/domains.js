import React from 'react';
import { storiesOf } from '@storybook/react-native';
import Domain from '../../src/components/elements/domains/Domain';
import ExpireDate from '../../src/components/elements/domains/ExpireDate';
import center from './_center';

const DomainStories = storiesOf('Domain', module).addDecorator(center);

const domain = {
	name: 'zeit.co',
	expiresAt: '2019-06-11T13:13:01.908Z',
	created: '2018-06-11T13:13:01.908Z',
};

DomainStories.add('With Expiration', () => <Domain domain={domain} />);
DomainStories.add('Without Expiration', () => (
	<Domain domain={{ ...domain, name: 'thirdparty.com', expiresAt: null }} />
));

const ExpireDateStories = storiesOf('ExpireDate', module).addDecorator(center);

ExpireDateStories.add('With Date', () => <ExpireDate date="2018-06-11T13:13:01.908Z" />);
ExpireDateStories.add('Without Date', () => <ExpireDate date={null} />);
