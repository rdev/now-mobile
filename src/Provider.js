// @flow
import React from 'react';
import qs from 'query-string';
import api from './lib/api';
import messages from './components/elements/history/messages';

type EventTypes = {
	auto: Set<string>,
	manual: Set<string>,
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
	mode: 'manual',
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
		const auto: Set<string> = new Set([
			'scale',
			'scale-auto',
			'deployment-freeze',
			'deployment-unfreeze',
			'cert-autorenew',
		]);

		const all = new Set(messages.keys());
		const manual = [...all].filter(t => !auto.has(t));

		return {
			auto,
			manual: new Set(manual),
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

		console.log(query);

		const { events, error } = await api.events(qs.stringify(query, { encode: false }));

		if (error) return this.state.events;
		return events;
	};

	setMode = (mode: 'manual' | 'auto'): Promise<void> =>
		new Promise(resolve => this.setState({ mode }, resolve));

	fetcher: IntervalID;

	fetchData = async () => {
		const user = await this.getUserInfo();
		const events = await this.getEvents();
		const domains = await this.getDomains();
		const aliases = await this.getAliases();
		const deployments = await this.getDeployments();
		const usage = await this.getUsage();

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
