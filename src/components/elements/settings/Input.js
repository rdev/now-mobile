// @flow
import React from 'react';
import styled from 'styled-components';
import { platformBlackColor } from '../../../lib/utils';

type Props = {
	onChangeText: (inputValue: string) => void,
	value: string,
	width?: string,
	style?: { [string]: any },
	numeric?: boolean,
};

const Input = styled.TextInput`
	color: ${({ value }) => (value === '0' ? '#D3D3D3' : platformBlackColor)};
	font-size: 18px;
	font-weight: 300;
	width: ${({ width }) => width || '70%'};
	border-bottom-width: 1px;
	border-bottom-color: ${({ value }) => (value && value !== '0' ? 'black' : '#D3D3D3')};
	text-align: center;
	padding-vertical: 10px;
`;

export default ({
	onChangeText, value, width, style, numeric,
}: Props) => (
	<Input
		onChangeText={onChangeText}
		value={value}
		underlineColorAndroid="rgba(0,0,0,0)"
		width={width}
		style={style}
		keyboardType={numeric ? 'number-pad' : 'default'}
	/>
);
