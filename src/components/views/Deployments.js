import React, { Component } from 'react';
import styled from 'styled-components';

const Text = styled.Text`
	color: blue;
`;

export default class Deployments extends Component {
	state = {};

	render() {
		return (
			<Text>
				Deployments View
			</Text>
		);
	}
}
