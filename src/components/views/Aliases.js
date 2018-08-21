// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import Alias from '../elements/aliases/Alias';
import AliasGroup from '../elements/aliases/AliasGroup';
import { connect } from '../../Provider';

type Props = {
	context: any | Context,
};

type AliasData = {
	alias: Zeit$Alias,
	last: boolean,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class Aliases extends Component<Props> {
	renderItem = ({ item }: { item: AliasData }) =>
		(item.alias.rules ? (
			<AliasGroup alias={item.alias} last={item.last} />
		) : (
			<Alias alias={item.alias} last={item.last} />
		));
	render() {
		const { reloadAliases, refreshing } = this.props.context;
		const aliases = this.props.context.aliases.sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ErrorBoundary viewName="aliases">
				<FlatList
					contentContainerStyle={containerStyle}
					data={aliases.map((alias, i) => ({ alias, last: i === aliases.length - 1 }))}
					renderItem={this.renderItem}
					keyExtractor={item => item.alias.uid}
					onRefresh={reloadAliases}
					refreshing={refreshing === 'aliases' || refreshing === 'all'}
				/>
			</ErrorBoundary>
		);
	}
}
