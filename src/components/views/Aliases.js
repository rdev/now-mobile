// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import Alias from '../elements/aliases/Alias';
import AliasGroup from '../elements/aliases/AliasGroup';
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
		const aliases = this.props.context.aliases.sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ErrorBoundary viewName="aliases">
				<ScrollView contentContainerStyle={containerStyle}>
					{aliases.map((alias, i) =>
						(alias.rules ? (
							<AliasGroup
								alias={alias}
								key={alias.uid}
								last={i === aliases.length - 1}
							/>
						) : (
							<Alias
								key={alias.uid}
								alias={alias}
								last={i === aliases.length - 1}
							/>
						)))}
				</ScrollView>
			</ErrorBoundary>
		);
	}
}
