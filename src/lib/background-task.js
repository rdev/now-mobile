import BackgroundFetch from 'react-native-background-fetch';
import { saveDeployments } from '../extensions/today';
import api from './api';

const task = async (event) => {
	console.log('BACKGROUND TASK STARTING');

	const { deployments, error } = await api.deployments();

	if (error) {
		console.log('BACKGROUND TASK ERROR', error);
		BackgroundFetch.finish();
	} else {
		await saveDeployments(deployments);
		console.log('BACKGROUND TASK DONE');
		BackgroundFetch.finish();
	}
};

export default function setUpBackgroundTask() {
	BackgroundFetch.configure({ stopOnTerminate: false }, task, () =>
		console.log('BACKGROUND TASK FAILED TO START'));
}
