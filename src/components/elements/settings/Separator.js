import styled from 'styled-components';

const Separator = styled.View`
	height: 1px;
	border-bottom-color: ${props => props.theme.border};
	border-bottom-width: 1px;
	margin-vertical: 12px;
	width: 80%;
`;

export default Separator;
