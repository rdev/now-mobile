// @flow
import React from 'react';
import { AsyncStorage } from 'react-native';
import qs from 'query-string';
import api from './lib/api';
import messages from './components/elements/history/messages';

type EventTypes = {
	system: Set<string>,
	me: Set<string>,
};

const DEFAULT_CONTEXT = {
	user: {
		uid: '',
		email: '',
		username: '',
		date: null,
		billingChecked: true,
		avatar: '',
		github: false,
	},
	domains: [],
	aliases: [],
	deployments: [],
	events: [],
	mode: 'me',
	usage: {
		metrics: {
			logs: {},
			bandwidth: {},
		},
	},
	fetchData: () => {},
};

// $FlowFixMe RN's used Flow version doesn't know about context yet
const NowContext = React.createContext(DEFAULT_CONTEXT);

export const NowConsumer = NowContext.Consumer;

/**
 * Context provider containing all of the app's data
 *
 * @export
 * @class Provider
 * @extends {React.Component<*, Context>}
 */
export class Provider extends React.Component<*, Context> {
	// Shamelessly borrowed from Now Desktop
	static getEventTypes = (): EventTypes => {
		const system: Set<string> = new Set([
			'scale',
			'scale-auto',
			'deployment-freeze',
			'deployment-unfreeze',
			'cert-autorenew',
		]);

		const all = new Set(messages.keys());
		const manual = [...all].filter(t => !system.has(t));

		return {
			system,
			me: new Set(manual),
		};
	};

	state = DEFAULT_CONTEXT;

	componentDidMount = () => {
		this.fetchData();
		this.fetcher = setInterval(this.fetchData, 10 * 1000);
	};

	componentWillUnmount = () => {
		clearInterval(this.fetcher);
	};

	getUserInfo = async () => {
		const { user, error } = await api.user.vitals();

		if (error) return this.state.user;
		return user;
	};

	getDomains = async (): Promise<Zeit$Domain[]> => {
		const { domains, error } = await api.domains();

		if (error) return this.state.domains;
		return domains;
	};

	getAliases = async (): Promise<Zeit$Alias[]> => {
		const { aliases, error } = await api.aliases();

		if (error) return this.state.aliases;
		return aliases;
	};

	getUsage = async () => {
		const usage = await api.usage();

		if (usage.error) return this.state.usage;
		return usage;
	};

	getDeployments = async (): Promise<Zeit$Deployment[]> => {
		const { deployments, error } = await api.deployments();

		if (error) return this.state.deployments;
		return deployments;
	};

	getEvents = async (since?: string): Promise<Zeit$Event[]> => {
		const types = Provider.getEventTypes();
		const query = {
			since,
			until: new Date().toISOString(),
			limit: 25,
			types: Array.from(types[this.state.mode]).join(','),
		};

		const { events, error } = await api.events(qs.stringify(query, { encode: false }));

		if (error) return this.state.events;
		return events;
	};

	setMode = (mode: 'me' | 'system'): Promise<void> =>
		new Promise(resolve =>
			this.setState({ mode }, async () => {
				await this.reloadEvents();
				resolve();
			}));

	reloadEvents = async () => {
		const events = await this.getEvents();
		this.setState({ events });
	};

	fetcher: IntervalID;

	fetchData = async () => {
		const token = await AsyncStorage.getItem('@now:token');
		if (!token) return false;

		const apiCalls = [
			this.getUserInfo(),
			this.getEvents(),
			this.getDomains(),
			this.getAliases(),
			this.getDeployments(),
			this.getUsage(),
		];
		const [user, events, domains, aliases, deployments, usage] = await Promise.all(apiCalls);

		return new Promise((resolve) => {
			this.setState(
				{
					user,
					domains,
					aliases,
					usage,
					deployments,
					events,
				},
				resolve,
			);
		});
	};

	render() {
		return (
			<NowContext.Provider
				value={{
					...this.state,
					fetchData: this.fetchData,
					setMode: this.setMode,
				}}
			>
				{this.props.children}
			</NowContext.Provider>
		);
	}
}

/**
 * Redux-like connect decorator to provide context to components
 *
 * @export
 * @param {React.Component} WrappedComponent - Component to decorate
 * @returns {React.Component}
 */
export function connect(WrappedComponent: typeof React.Component | Function) {
	return (props: any) => (
		<NowConsumer>{context => <WrappedComponent {...props} context={context} />}</NowConsumer>
	);
}
