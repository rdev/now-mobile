// @flow
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';
import HistoryItem from '../elements/history/HistoryItem';
import ModeSwitcher from '../elements/history/ModeSwitcher';
import { connect } from '../../Provider';

type Props = {
	context: Context,
};

const containerStyle = {
	paddingBottom: 80,
	paddingHorizontal: '6%',
};

@connect
export default class History extends Component<Props> {
	loadMore = () => {
		const { getEvents, events } = this.props.context;
		const lastEvent = events[events.length - 1];
		if (lastEvent) getEvents(lastEvent.created);
	};

	renderItem = ({ item }: { item: Zeit$Event }) =>
		// This is dirty, but it gets the job done
		(item.id === 'switcher' ? (
			<ModeSwitcher
				onSystemPress={() => this.props.context.setMode('system')}
				onMePress={() => this.props.context.setMode('me')}
				onTeamPress={() => this.props.context.setMode('team')}
				active={this.props.context.mode}
				team={this.props.context.team}
			/>
		) : (
			<HistoryItem
				event={item}
				user={this.props.context.user}
				team={this.props.context.team}
			/>
		));

	render() {
		const { context } = this.props;
		// Idk if it's FlatList or events or me being dumb, but some times it yelles at duplicate keys. Using Set here to force dedupe everything
		const events = Array.from(new Set(context.events)).sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ErrorBoundary viewName="history">
				<FlatList
					contentContainerStyle={containerStyle}
					data={[{ id: 'switcher' }, ...events]}
					// $FlowFixMe I know what I'm doing
					renderItem={this.renderItem}
					contentOffset={{ y: 42 }}
					onEndReached={this.loadMore}
					keyExtractor={item => (item === 'switcher' ? 'switcher' : item.id)}
					onRefresh={() => context.reloadEvents(true)}
					refreshing={context.refreshing}
				/>
			</ErrorBoundary>
		);
	}
}
