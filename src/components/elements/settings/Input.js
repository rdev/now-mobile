// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
	onChangeText: (inputValue: string) => void,
	value: string,
	width?: string,
	style?: { [string]: any },
	numeric?: boolean,
};

const Input = styled.TextInput`
	color: ${({ value, theme }) => (value === '0' ? theme.input : theme.text)};
	font-size: 18px;
	font-weight: 300;
	width: ${({ width }) => width || '70%'};
	border-bottom-width: 1px;
	border-bottom-color: ${({ value, theme }) =>
		(value && value !== '0' ? theme.text : theme.input)};
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
