// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import EmptyResults from '../EmptyResults';
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
	renderItem = ({ item, i }: { item: Zeit$Alias, i: number }) =>
		(item.rules ? (
			<AliasGroup
				key={item.uid}
				alias={item}
				last={i === this.props.context.aliases.length - 1}
			/>
		) : (
			<Alias key={item.uid} alias={item} last={i === this.props.context.aliases.length - 1} />
		));

	render() {
		const { context } = this.props;
		const aliases = context.aliases.sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ErrorBoundary viewName="aliases">
				<FlatList
					contentContainerStyle={containerStyle}
					data={aliases}
					ListEmptyComponent={<EmptyResults viewName="aliases" />}
					renderItem={this.renderItem}
					onEndReached={this.loadMore}
					keyExtractor={item => item.uid}
					onRefresh={() => context.reloadAliases(true)}
					refreshing={context.refreshing}
				/>
			</ErrorBoundary>
		);
	}
}
