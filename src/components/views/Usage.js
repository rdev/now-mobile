import React, { Component } from 'react';
import styled from 'styled-components';

const Text = styled.Text`
	color: blue;
`;

export default class Usage extends Component {
	state = {};

	render() {
		return (
			<Text>
				Usage View
			</Text>
		);
	}
}
