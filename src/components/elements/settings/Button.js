import styled from 'styled-components';

const Button = styled.Text`
	font-size: 18px;
	font-weight: 300;
	color: ${props => props.theme.settingsButton};
`;

export default Button;
