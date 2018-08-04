import React from 'react';
import styled from 'styled-components';
import { platformBlackColor } from '../../../lib/utils';

const Input = styled.TextInput`
	color: ${platformBlackColor()};
	font-size: 18px;
	font-weight: 300;
	width: 70%;
	border-bottom-width: 1px;
	border-bottom-color: ${({ value }) => (value ? 'black' : '#D3D3D3')};
	text-align: center;
	padding-vertical: 10px;
`;

export default ({ onChange, value }) => (
	<Input onChangeText={onChange} value={value} underlineColorAndroid="rgba(0,0,0,0)" />
);
