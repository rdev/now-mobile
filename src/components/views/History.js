// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from '../../Provider';

type Props = {
	context: Context,
};

const Text = styled.Text`
	color: blue;
`;

@connect
export default class History extends Component<Props> {
	render() {
		return <Text>History View</Text>;
	}
}
