import React, { Component } from 'react';
import styled from 'styled-components';

const Text = styled.Text`
	color: blue;
`;

export default class History extends Component {
	state = {};

	render() {
		return <Text>History View</Text>;
	}
}
