// @flow
import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
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
	const periodEnd = moment(metrics.startTime)
		.add(1, 'month')
		.format('MMMM DD, YYYY')
		.toUpperCase();

	return (
		<ScrollView contentContainerStyle={containerStyle}>
			<UsageEntry usage={metrics.domains} max={max.domains} name="Domains" />
			<UsageEntry usage={metrics.activeInstances} max={max.instances} name="Instances" />
			<UsageEntry
				usage={formatBytes(metrics.bandwidth.tx)}
				max={formatBytes(max.bandwidth)}
				name="Bandwidth"
			/>
			<UsageEntry
				usage={formatBytes(metrics.logs.size)}
				max={formatBytes(max.logs)}
				name="Logs"
			/>
			<Period>
				{periodStart} - {periodEnd}
			</Period>
		</ScrollView>
	);
};

export default connect(Usage);
