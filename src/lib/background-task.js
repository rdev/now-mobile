/* @flow */
import BackgroundFetch from 'react-native-background-fetch';
import { AsyncStorage } from 'react-native';
// $FlowFixMe Flow hates this module
import PushNotification from 'react-native-push-notification';
import { saveDeployments, saveUsage } from '../extensions/today';
import { getUsageLimits, plans, formatBytes } from '../lib/utils';
import api from './api';

type InstanceAlertData = {
	instances: number,
	limit: number,
	planLimit: number,
	lastCount: number,
};

type BandwidthAlertData = {
	bandwidth: number,
	limit: number,
	planLimit: number,
	lastAlertDate: ?Date,
	billingPeriodStart: Date,
};

type LogsAlertData = {
	logs: number,
	limit: number,
	planLimit: number,
	lastAlertDate: ?Date,
	billingPeriodStart: Date,
};

const handleInstances = async ({
	instances, lastCount, limit, planLimit,
}: InstanceAlertData) => {
	// For instances we alert in following conditions:
	// 1. We're over the limit
	// 2. Last update's instance count was lower than what we have now.
	// ^ This will alert every time an additional instance appears, but IMO it's a good thing for accidental aggressive auto-scaling
	//   It will also take "cooldown" into account

	if (instances > limit && instances > lastCount) {
		PushNotification.localNotification({
			title: `You're ${instances > planLimit ? 'over' : 'approaching'} your plan limit`,
			message: `Your instance usage is at ${instances} / ${limit}`,
		});
	}

	await AsyncStorage.setItem('lastInstanceCount', instances.toString());
};

const handleBandwidth = async ({
	bandwidth,
	lastAlertDate,
	limit,
	planLimit,
	billingPeriodStart,
}: BandwidthAlertData) => {
	// For bandwidth we alert in following conditions:
	// 1. We're over the limit
	// 2. We haven't alerted about bandwidth during this billing period yet

	const isDateAppropriate = !!(!lastAlertDate || lastAlertDate < billingPeriodStart);

	if (bandwidth > limit && isDateAppropriate) {
		PushNotification.localNotification({
			title: `You're ${bandwidth > planLimit ? 'over' : 'approaching'} your plan limit`,
			message: `Your bandwidth usage is at ${formatBytes(bandwidth)} / ${formatBytes(limit)}`,
		});
		await AsyncStorage.setItem('@now:lastBandwidthAlert', new Date().toISOString());
	}
};

const handleLogs = async ({
	logs,
	lastAlertDate,
	limit,
	planLimit,
	billingPeriodStart,
}: LogsAlertData) => {
	// For logs we alert in the same conditions as bandwidth
	const isDateAppropriate = !!(!lastAlertDate || lastAlertDate < billingPeriodStart);

	if (logs > limit && isDateAppropriate) {
		PushNotification.localNotification({
			title: `You're ${logs > planLimit ? 'over' : 'approaching'} your plan limit`,
			message: `Your logs usage is at ${formatBytes(logs)} / ${formatBytes(limit)}`,
		});
		await AsyncStorage.setItem('@now:lastLogshAlert', new Date().toISOString());
	}
};

const notifyIfAppropriate = async (usage: Zeit$Usage) => {
	// This part is a little convoluted, so bear with me
	const limits = await getUsageLimits(usage.plan);
	const plan = plans.get(usage.plan);

	if (!plan) return;

	const lastInstanceCountString = await AsyncStorage.getItem('@now:lastInstanceCount');
	const lastInstanceCount = lastInstanceCountString ? parseInt(lastInstanceCountString, 10) : 0;
	const lastBandwidthAlert = await AsyncStorage.getItem('@now:lastBandwidthAlert');
	const lastLogsAlert = await AsyncStorage.getItem('@now:lastLogsAlert');

	// Get current usage in "instances", "bandwidht" and "logs" variables (or <constants>, if you're nasty)
	const {
		activeInstances: instances,
		bandwidth: bandwidthUsage,
		logs: logsUsage,
	} = usage.metrics;
	const { tx: bandwidth } = bandwidthUsage;
	const { size: logs } = logsUsage;

	await handleInstances({
		instances,
		lastCount: lastInstanceCount,
		limit: limits.instances,
		planLimit: plan.concurrentInstances,
	});
	await handleBandwidth({
		bandwidth,
		lastAlertDate: lastBandwidthAlert ? new Date(lastBandwidthAlert) : null,
		limit: limits.bandwidth,
		planLimit: plan.bandwidth,
		billingPeriodStart: new Date(usage.metrics.startTime),
	});
	await handleLogs({
		logs,
		lastAlertDate: lastLogsAlert ? new Date(lastLogsAlert) : null,
		limit: limits.logs,
		planLimit: plan.logs,
		billingPeriodStart: new Date(usage.metrics.startTime),
	});
};

export const task = async () => {
	console.log('BACKGROUND TASK STARTING');

	const { deployments, error: deploymentsError } = await api.deployments();
	const usage = await api.usage();

	if (deploymentsError || usage.error) {
		console.log('BACKGROUND TASK ERROR', deploymentsError, usage.error);
		BackgroundFetch.finish();
	} else {
		await saveDeployments(deployments);
		await saveUsage(usage);
		await notifyIfAppropriate(usage);

		console.log('BACKGROUND TASK DONE');
		BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
	}
};

export default function setUpBackgroundTask() {
	BackgroundFetch.configure(
		{
			stopOnTerminate: false,
			startOnBoot: true,
			enableHeadless: true,
		},
		task,
		() => console.log('BACKGROUND TASK FAILED TO START'),
	);
}
