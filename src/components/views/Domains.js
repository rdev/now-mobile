// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import EmptyResults from '../EmptyResults';
import Domain from '../elements/domains/Domain';
import { connect } from '../../Provider';

type Props = {
	context: any | Context,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class Domains extends Component<Props> {
	renderItem = ({ item, i }: { item: Zeit$Domain, i: number }) => (
		<Domain key={item.uid} domain={item} last={i === this.props.context.domains.length - 1} />
	);

	render() {
		const { context } = this.props;
		const domains = context.domains.sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ErrorBoundary viewName="domains">
				<FlatList
					contentContainerStyle={containerStyle}
					data={domains}
					ListEmptyComponent={<EmptyResults viewName="domains" />}
					renderItem={this.renderItem}
					onEndReached={this.loadMore}
					keyExtractor={item => item.uid}
					onRefresh={() => context.reloadDomains(true)}
					refreshing={context.refreshing}
				/>
			</ErrorBoundary>
		);
	}
}
