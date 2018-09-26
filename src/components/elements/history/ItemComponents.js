import styled from 'styled-components';

export const Text = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: ${props => props.theme.lightText};
`;

// Not really bold but I couldn't think of a proper name
export const Bold = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: ${props => props.theme.text};
`;

export const MonospaceWrap = styled.View`
	background-color: ${props => props.theme.monoBackground};
	border-radius: 4px;
	margin-top: 15px;
`;

export const Monospace = styled.Text`
	font-size: 15px;
	font-family: 'Menlo';
	color: ${props => props.theme.lightText};
	margin: 15px;
`;
