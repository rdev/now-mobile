// @flow
import React from 'react';
import { FlatList } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import EmptyResults from '../EmptyResults';
import Domain from '../elements/domains/Domain';
import { connect } from '../../Provider';

type Props = {
	context: any | Context,
};

type DomainData = {
	domain: Zeit$Domain,
	last: boolean,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class Domains extends React.Component<Props> {
	renderItem = ({ item }: { item: DomainData }) => (
		<Domain key={item.domain.uid} domain={item.domain} last={item.last} />
	);

	render() {
		const { reloadDomains, refreshing } = this.props.context;
		const domains = this.props.context.domains.sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ErrorBoundary viewName="domains">
				<FlatList
					contentContainerStyle={containerStyle}
					data={domains.map((domain, i) => ({ domain, last: i === domains.length - 1 }))}
					ListEmptyComponent={<EmptyResults viewName="domains" />}
					renderItem={this.renderItem}
					keyExtractor={item => item.domain.uid}
					onRefresh={reloadDomains}
					refreshing={refreshing === 'domains' || refreshing === 'all'}
				/>
			</ErrorBoundary>
		);
	}
}
