/* @flow */
import React from 'react';
import styled from 'styled-components';
import Input from './Input';

type Props = {
	label?: boolean,
	value: string,
	onChangeText: (val: string) => void,
};

const View = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

const Label = styled.Text`
	font-size: 18px
	font-weight: 400;
	color: ${({ active, theme }) => (active ? theme.text : theme.input)};
`;

export default ({ label, value, onChangeText }: Props) => (
	<View>
		<Input
			style={{ paddingTop: 0, paddingBottom: 3 }}
			onChangeText={onChangeText}
			value={value}
			width="40px"
			numeric
		/>
		{label ? <Label active={value !== '0'}>GB</Label> : null}
	</View>
);
