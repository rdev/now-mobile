// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from '../Provider';
import ZeitLogo from '../../assets/zeit-logo.png';
import ZeitLogoWhite from '../../assets/zeit-logo-white.png';

type Props = {
	size?: string,
	style?: any,
	context: any | Context,
};

// We need Zeit logo to be bigger in some cases (authentication)
function setLogoSize(size: string) {
	if (size === 'large') {
		return { h: '57px', w: '64px' };
	}

	return { h: '30px', w: '34px' };
}

const Image = styled.Image`
	height: ${({ size }) => setLogoSize(size).h};
	width: ${({ size }) => setLogoSize(size).w};
`;

const Logo = ({ size, style, context }: Props) => (
	<Image source={context.darkMode ? ZeitLogoWhite : ZeitLogo} size={size} style={style} />
);

Logo.defaultProps = {
	size: '',
	style: null,
};

export default connect(Logo);
