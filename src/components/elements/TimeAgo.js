// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

type Props = {
	date: ?string,
	bracketed?: boolean,
};

moment.updateLocale('en', {
	relativeTime: {
		s: '%ds',
		ss: '%ds',
		m: '%dm',
		mm: '%dm',
		h: '%dh',
		hh: '%dh',
		d: '%dd',
		dd: '%dd',
	},
});

const Text = styled.Text`
	color: #848484;
	font-weight: 300;
	font-size: 16px;
`;

export default ({ date, bracketed }: Props) => {
	const diff = moment().diff(moment(date), 'days');
	if (diff > 1) {
		return <Text bracketed={bracketed}>{bracketed ? `[${diff}d]` : `${diff}d`}</Text>;
	}
	return (
		<Text bracketed={bracketed}>
			{bracketed ? `[${moment(date).fromNow(true)}]` : moment(date).fromNow(true)}
		</Text>
	);
};
