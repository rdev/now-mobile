// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

type Props = {
	date: ?string,
}

const Text = styled.Text`
	font-size: 18px
`;

export default ({ date }: Props) => (
	<Text>{date ? moment(date).format('DD MMM YY') : '-'}</Text>
);
