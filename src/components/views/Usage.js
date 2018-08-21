// @flow
import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import ErrorBoundary from '../ErrorBoundary';
import UsageEntry from '../elements/usage/UsageEntry';
import { connect } from '../../Provider';
import { plans, formatBytes } from '../../lib/utils';

type Props = {
	context: any | Context,
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
const Usage = ({ context }: Props) => {
	const { mode, metrics } = context.usage;
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

	return (
		<ErrorBoundary viewName="usage">
			<ScrollView
				contentContainerStyle={containerStyle}
				refreshControl={
					<RefreshControl
						refreshing={context.refreshing}
						onRefresh={() => context.reloadUsage(true)}
					/>
				}
			>
				<UsageEntry usage={metrics.domains} max={max.domains} name="Domains" />
				<UsageEntry
					usage={metrics.activeInstances}
					max={max.instances === Infinity ? '∞' : max.instances}
					name="Instances"
				/>
				<UsageEntry
					usage={formatBytes(metrics.bandwidth.tx)}
					max={max.bandwidth === Infinity ? '∞' : formatBytes(max.bandwidth)}
					name="Bandwidth"
				/>
				<UsageEntry
					usage={formatBytes(metrics.logs.size)}
					max={max.logs === Infinity ? '∞' : formatBytes(max.logs)}
					name="Logs"
				/>
				<Period>
					{periodStart} - {periodEnd}
				</Period>
			</ScrollView>
		</ErrorBoundary>
	);
};

export default connect(Usage);
