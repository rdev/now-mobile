// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import Alias from '../elements/aliases/Alias';
import { connect } from '../../Provider';

type Props = {
	context: any | Context,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class Aliases extends Component<Props> {
	render() {
		const aliases = this.props.context.aliases.sort((a, b) =>
			new Date(b.created) - new Date(a.created));

		return (
			<ScrollView contentContainerStyle={containerStyle}>
				{aliases.map((alias, i) => (
					<Alias key={alias.uid} alias={alias} last={i === aliases.length - 1} />
				))}
			</ScrollView>
		);
	}
}
