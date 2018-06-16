import React from 'react';
import { storiesOf } from '@storybook/react-native';
import UsageEntry from '../../src/components/elements/usage/UsageEntry';
import center from './_center';

const UsageEntryStories = storiesOf('UsageEntry', module).addDecorator(center);

UsageEntryStories.add('Numbers', () => <UsageEntry usage={2} max={5} name="Domains" />);
UsageEntryStories.add('Strings', () => <UsageEntry usage="274MB" max="10GB" name="Bandwidth" />);
UsageEntryStories.add('Borderless', () => <UsageEntry usage="274MB" max="1GB" name="Logs" />);
