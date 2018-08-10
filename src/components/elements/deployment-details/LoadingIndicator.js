import React from 'react';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components';
import Logo from '../../Logo';

const LoadingIndicator = styled.View`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

export default () => (
	<LoadingIndicator>
		<Animatable.View
			animation="fadeOut"
			easing="ease-out"
			iterationCount="infinite"
			direction="alternate"
			duration={600}
		>
			<Logo size="large" />
		</Animatable.View>
	</LoadingIndicator>
);
