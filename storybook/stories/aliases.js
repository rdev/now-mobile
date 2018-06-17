/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import Alias from '../../src/components/elements/aliases/Alias';
import center from './_center';

const AliasStories = storiesOf('Alias', module).addDecorator(center);

AliasStories.add('Default', () => (
	<Alias
		alias={{
			alias: 'zeit.co',
			deployment: { url: 'zeit-vbcxbzxcba.now.sh', created: '2018-06-16T17:13:01.908Z' },
		}}
	/>
));
AliasStories.add('Borderless', () => (
	<Alias
		alias={{
			alias: 'api.zeit.co',
			deployment: { url: 'zeit-api-dcvacbccd.now.sh', created: '2018-06-19T17:13:01.908Z' },
		}}
		last
	/>
));
