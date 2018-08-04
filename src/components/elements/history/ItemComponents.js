import styled from 'styled-components';
import { platformBlackColor } from '../../../lib/utils';

export const Text = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: #848484;
`;

// Not really bold but I couldn't think of a proper name
export const Bold = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: ${platformBlackColor};
`;

export const MonospaceWrap = styled.View`
	background-color: #f5f5f5;
	border-radius: 4px;
	margin-top: 15px;
`;

export const Monospace = styled.Text`
	font-size: 15px;
	font-family: 'Menlo';
	color: #848484;
	margin: 15px;
`;
