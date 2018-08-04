// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { platformBlackColor } from '../../../lib/utils';

type Props = {
	date: ?string,
};

const Text = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${platformBlackColor};
`;

export default ({ date }: Props) => <Text>{date ? moment(date).format('DD MMM YYYY') : '-'}</Text>;
