/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Image } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import Input from '../../src/components/elements/settings/Input';
import Button from '../../src/components/elements/settings/Button';
import ProfilePic from '../../src/components/elements/settings/ProfilePic';
import NowLogo from '../../assets/now-white.png';
import center from './_center';

const SettingsInputStories = storiesOf('SettingsInput', module).addDecorator(center);

SettingsInputStories.add('Default', () => <Input value="username" onChangeText={alert} />);

const SettingsButtonStories = storiesOf('SettingsButton', module).addDecorator(center);

SettingsButtonStories.add('Default', () => <Button>button</Button>);

const SettingsProfilePicStories = storiesOf('SettingsUserpic', module).addDecorator(center);

SettingsProfilePicStories.add('Default', () => (
	<ProfilePic>
		<Image source={NowLogo} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
	</ProfilePic>
));
