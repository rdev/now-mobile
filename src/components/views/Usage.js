// @flow
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import ErrorBoundary from '../ErrorBoundary';
import EmptyResults from '../EmptyResults';
import UsageEntry from '../elements/usage/UsageEntry';
import { connect } from '../../Provider';
import { plans, formatBytes, promptOpen } from '../../lib/utils';

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

const UsageRow = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`;

const Period = styled.Text`
	font-weight: 300;
	font-size: 15px;
	color: ${props => props.theme.magenta};
	margin-top: 10px;
	margin-bottom: 20px;
	letter-spacing: 0.5px;
	text-align: center;
`;

const Button = styled.Text`
	font-weight: 400;
	font-size: 16px;
	color: ${props => props.theme.settingsButton};
`;

const containerStyle = {
	paddingBottom: 50,
	alignItems: 'center',
};

// This is new and Zeit sometimes still changes the API for this
@connect
export default class Usage extends React.Component<Props> {
	renderItem = ({ item }: { item: UsageData | UsageData[] }) => {
		if (item.start && item.end) {
			return (
				<Period>
					{item.start} - {item.end}
				</Period>
			);
		} else if (item.name === 'Invoices') {
			return (
				<TouchableOpacity
					activeOpacity={0.65}
					onPress={() => promptOpen('https://zeit.co/dashboard/usage')}
					style={{ marginTop: 20 }}
				>
					<Button>View Invoices</Button>
				</TouchableOpacity>
			);
		}

		return (
			<UsageRow>
				<UsageEntry
					usage={
						typeof item[0].current !== 'number' && !item[0].current
							? 'N/A'
							: item[0].current
					}
					max={item[0].max || 'N/A'}
					name={item[0].name}
				/>
				<UsageEntry
					usage={
						typeof item[1].current !== 'number' && !item[1].current
							? 'N/A'
							: item[1].current
					}
					max={item[1].max || 'N/A'}
					name={item[1].name}
				/>
			</UsageRow>
		);
	};

	render() {
		const { usage, reloadUsage, refreshing } = this.props.context;
		const { metrics } = usage;
		const plan = plans.get(usage.plan);

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
				name: 'Period',
				start: periodStart,
				end: periodEnd,
			},
			[
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
			],
			[
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
			],
			{ name: 'Invoices' },
		];

		return (
			<ErrorBoundary viewName="usage">
				<FlatList
					contentContainerStyle={containerStyle}
					data={data}
					ListEmptyComponent={<EmptyResults viewName="usage" />}
					renderItem={this.renderItem}
					keyExtractor={item => (Array.isArray(item) ? item[0].name : item.name)}
					onRefresh={reloadUsage}
					refreshing={refreshing === 'usage' || refreshing === 'all'}
				/>
			</ErrorBoundary>
		);
	}
}
