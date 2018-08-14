// @flow
// Utilities
import React from 'react';
import parseUA from '../../../../lib/useragent';
import { Text, Bold } from '../ItemComponents';
import Message from './message';

const osNames = {
	darwin: 'macOS',
	win32: 'Windows',
	linux: 'Linux',
	freebsd: 'FreeBSD',
	sunos: 'SunOS',
	'Mac OS': 'macOS',
	ios: 'iOS',
	android: 'Android',
};

const isMobile = ua =>
	ua.includes('now-mobile') || ua.includes('CFNetwork') || ua.includes('okhttp');

/* eslint-disable no-nested-ternary, prefer-destructuring, prefer-const */
export default class Login extends Message {
	render() {
		const {
			event: { payload },
		} = this.props;

		let { userAgent, geolocation } = payload;
		userAgent = parseUA(userAgent);

		let from;
		let os;

		if (userAgent) {
			if (userAgent.ua && userAgent.ua.includes('Electron/')) {
				from = 'Now Desktop';
			} else if (userAgent.ua && isMobile(userAgent.ua)) {
				from = 'Now Mobile';
			} else {
				from = userAgent.browser
					? userAgent.browser.name
					: userAgent.program
						? 'Now CLI'
						: null;
			}
			os = osNames[userAgent.os.name] || userAgent.os.name;
		} else {
			from = payload.env;
			os = payload.os;
		}

		if (userAgent.ua.includes('Electron/')) {
			from = 'Now Desktop';
		}

		let message = 'logged in';

		if (from) message += ` from ${from}`;
		if (os) message += ` on ${os}`;

		if (geolocation) {
			const city =
				geolocation.city && typeof geolocation.city === 'object'
					? geolocation.city.names.en
					: geolocation.city;
			const region =
				typeof geolocation.most_specific_subdivision === 'object'
					? geolocation.most_specific_subdivision.names.en
					: geolocation.regionName;

			// Only output location if both city and region are specified
			if (city) {
				if (city === region) {
					message += ` in ${city}`;
				} else {
					message += ` in ${city}, ${region}`;
				}
			}
		}

		return (
			<Text>
				<Bold>You</Bold> {message}
			</Text>
		);
	}
}
