// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
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
	render() {
		const { context } = this.props;
		const events = context.events.sort((a, b) => new Date(b.created) - new Date(a.created));

		return (
			<ScrollView contentContainerStyle={containerStyle} contentOffset={{ y: 42 }}>
				<ModeSwitcher
					onSystemPress={() => context.setMode('system')}
					onMePress={() => context.setMode('me')}
					onTeamPress={() => {}}
					active={context.mode}
					team={context.team}
				/>
				{events.map(event => (
					<HistoryItem
						event={event}
						user={context.user}
						team={context.team}
						key={event.id}
					/>
				))}
			</ScrollView>
		);
	}
}
