import BackgroundFetch from 'react-native-background-fetch';
import { saveDeployments, saveUsage } from '../extensions/today';
import api from './api';

const task = async (event) => {
	console.log('BACKGROUND TASK STARTING');

	const { deployments, error: deploymentsError } = await api.deployments();
	const { usage, error: usageError } = await api.usage();

	if (deploymentsError || usageError) {
		console.log('BACKGROUND TASK ERROR', deploymentsError, usageError);
		BackgroundFetch.finish();
	} else {
		await saveDeployments(deployments);
		await saveUsage(usage);
		console.log('BACKGROUND TASK DONE');
		BackgroundFetch.finish();
	}
};

export default function setUpBackgroundTask() {
	BackgroundFetch.configure({ stopOnTerminate: false }, task, () =>
		console.log('BACKGROUND TASK FAILED TO START'));
}
