// @flow
import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import ErrorBoundary from '../ErrorBoundary';
import EmptyResults from '../EmptyResults';
import UsageEntry from '../elements/usage/UsageEntry';
import { connect } from '../../Provider';
import { plans, formatBytes } from '../../lib/utils';

type Props = {
	context: any | Context,
};

type UsageData = {
	name: string,
	current?: string | number,
	max?: string | number,
	start?: string,
	end?: string,
};

const Period = styled.Text`
	font-weight: 300;
	font-size: 15px;
	color: #b5b5b5;
	margin-top: 20px;
	letter-spacing: 0.5px;
`;

const containerStyle = {
	paddingBottom: 50,
	paddingHorizontal: '6%',
	alignItems: 'center',
};

// This is new and Zeit sometimes still changes the API for this
@connect
export default class Usage extends React.Component<Props> {
	renderItem = ({ item }: { item: UsageData }) =>
		(item.start && item.end ? (
			<Period>
				{item.start} - {item.end}
			</Period>
		) : (
			// This should never happen, but Flow complains, so putting N/A here just in case
			<UsageEntry
				usage={typeof item.current !== 'number' && !item.current ? 'N/A' : item.current}
				max={item.max || 'N/A'}
				name={item.name}
			/>
		));

	render() {
		const { usage, reloadUsage, refreshing } = this.props.context;
		const { mode, metrics } = usage;
		const plan = plans.get(mode);

		// Right half of this ternary should never happen, unless Zeit does something breaking
		const max = plan
			? {
				domains: plan.domains,
				bandwidth: plan.bandwidth,
				logs: plan.logs,
				instances: plan.concurrentInstances,
			  }
			: {
				domains: 0,
				bandwidth: 0,
				logs: 0,
				instances: 0,
			  };

		const periodStart = moment(metrics.startTime)
			.format('MMMM DD, YYYY')
			.toUpperCase();
		const periodEnd = moment()
			.format('MMMM DD, YYYY')
			.toUpperCase();

		const data = [
			{
				name: 'Domains',
				current: metrics.domains,
				max: max.domains,
			},
			{
				name: 'Instances',
				current: metrics.activeInstances,
				max: max.instances === Infinity ? '∞' : max.instances,
			},
			{
				name: 'Bandwidth',
				current: formatBytes(metrics.bandwidth.tx),
				max: max.bandwidth === Infinity ? '∞' : formatBytes(max.bandwidth),
			},
			{
				name: 'Logs',
				current: formatBytes(metrics.logs.size),
				max: max.logs === Infinity ? '∞' : formatBytes(max.logs),
			},
			{
				name: 'Period',
				start: periodStart,
				end: periodEnd,
			},
		];

		return (
			<ErrorBoundary viewName="usage">
				<FlatList
					contentContainerStyle={containerStyle}
					data={data}
					ListEmptyComponent={<EmptyResults viewName="usage" />}
					renderItem={this.renderItem}
					keyExtractor={item => item.name}
					onRefresh={reloadUsage}
					refreshing={refreshing === 'usage' || refreshing === 'all'}
				/>
			</ErrorBoundary>
		);
	}
}
