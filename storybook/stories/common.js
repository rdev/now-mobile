/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import TimeAgo from '../../src/components/elements/TimeAgo';
import AuthInput from '../../src/components/elements/AuthInput';
import Logo from '../../src/components/Logo';
import Header from '../../src/components/Header';
import center from './_center';

const LogoStories = storiesOf('Logo', module).addDecorator(center);

LogoStories.add('Small', () => <Logo />);
LogoStories.add('Large', () => <Logo size="large" />);

const AuthInputStories = storiesOf('AuthInput', module).addDecorator(center);

AuthInputStories.add('Default', () => <AuthInput />);

const TimeAgoStories = storiesOf('TimeAgo', module).addDecorator(center);

TimeAgoStories.add('Default', () => <TimeAgo date="2018-06-11T13:13:01.908Z" />);

const HeaderStories = storiesOf('Header', module).addDecorator(center);

HeaderStories.add('Default', () => <Header />);
