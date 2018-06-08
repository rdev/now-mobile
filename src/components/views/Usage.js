// @flow
import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import UsageEntry from '../elements/usage/UsageEntry';
import { connect } from '../../Provider';
import { plans, formatBytes } from '../../lib/utils';

type Props = {
	context: any | Context;
}

const Period = styled.Text`
	font-weight: 300;
	font-size: 15px;
	color: #B5B5B5;
	margin-top: 20px;
	letter-spacing: 0.5px;
`;

const Usage = ({ context }: Props) => {
	console.log(context);
	const { mode, metrics } = context.usage;

	const max = {
		domains: plans.get(mode).domains,
		bandwidth: plans.get(mode).bandwidth,
		logs: plans.get(mode).logs,
		instances: plans.get(mode).concurrentInstances,
	};

	const periodStart = moment(metrics.startTime).format('MMMM DD, YYYY').toUpperCase();
	const periodEnd = moment(metrics.startTime).add(1, 'month').format('MMMM DD, YYYY').toUpperCase();

	return (
		<ScrollView contentContainerStyle={{ paddingHorizontal: '6%', alignItems: 'center', height: '100%' }}>
			<UsageEntry usage={metrics.domains} max={max.domains} name="Domains" />
			<UsageEntry usage={metrics.activeInstances} max={max.instances} name="Instances" />
			<UsageEntry usage={(formatBytes(metrics.bandwidth.tx))} max={formatBytes(max.bandwidth)} name="Bandwidth" />
			<UsageEntry usage={(formatBytes(metrics.logs.size))} max={formatBytes(max.logs)} name="Logs" />
			<Period>
				{periodStart} - {periodEnd}
			</Period>
		</ScrollView>
	);
};

export default connect(Usage);
