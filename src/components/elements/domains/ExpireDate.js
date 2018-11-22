// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

type Props = {
	date: ?string,
};

const Text = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${props => props.theme.text};
`;

export default ({ date }: Props) => <Text>{date ? moment(date).format('DD MMM YYYY') : '-'}</Text>;
