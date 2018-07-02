// @flow
import React from 'react';
import { AsyncStorage, ActionSheetIOS } from 'react-native';
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
	teams: [],
	mode: 'me',
	usage: {
		metrics: {
			logs: {},
			bandwidth: {},
		},
	},
	team: null,
	refreshing: false,
	fetchData: () => {},
	setMode: () => {},
	getEvents: () => [],
	reloadEvents: () => {},
	toggleDropdown: () => {},
	dropdownVisible: false,
	networkError: false,
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

	getEvents = async (until?: string): Promise<Zeit$Event[]> => {
		const types = Provider.getEventTypes();
		const query = {
			until: until || new Date().toISOString(),
			limit: 25,
			types: Array.from(types[this.state.mode]).join(','),
		};

		const { events, error } = await api.events(qs.stringify(query, { encode: false }));

		if (error) {
			this.setState({ networkError: true });
			return this.state.events;
		}

		if (until) {
			this.setState({ events: [...this.state.events, ...events], networkError: false });
		}

		return events;
	};

	getTeams = async (): Promise<Zeit$Team[]> => {
		const { teams, error } = await api.teams.getTeams();

		if (error) return this.state.teams;
		return teams;
	};

	setMode = (mode: 'me' | 'system'): Promise<void> =>
		new Promise((resolve) => {
			if (mode === this.state.mode) resolve();

			this.setState({ mode }, async () => {
				await this.reloadEvents();
				resolve();
			});
		});

	setRefreshing = (refreshing: boolean): Promise<void> =>
		new Promise((resolve) => {
			this.setState({ refreshing }, resolve);
		});

	setTeam = (team: ?Zeit$Team): Promise<void> =>
		new Promise(async (resolve) => {
			console.log('SETTING TEAM', team);
			await AsyncStorage.setItem('@now:teamId', team ? team.id : null);
			this.setState({ team }, async () => {
				await this.fetchData();
				resolve();
			});
		});

	reloadEvents = async (showIndicator?: boolean) => {
		if (showIndicator) await this.setRefreshing(true);
		const events = await this.getEvents();
		this.setState({ events, refreshing: false });
	};

	fetchData = async () => {
		try {
			console.log('FETCHING DATA');
			const token = await AsyncStorage.getItem('@now:token');
			if (!token) return false;

			const apiCalls = [
				this.getUserInfo(),
				this.getEvents(),
				this.getDomains(),
				this.getAliases(),
				this.getDeployments(),
				this.getUsage(),
				this.getTeams(),
			];
			const [user, events, domains, aliases, deployments, usage, teams] = await Promise.all(apiCalls);

			return new Promise((resolve) => {
				this.setState(
					{
						user,
						domains,
						aliases,
						usage,
						deployments,
						events,
						teams,
						networkError: false,
					},
					resolve,
				);
			});
		} catch (e) {
			this.setState({ networkError: true });

			return new Promise((resolve, reject) => {
				reject();
			});
		}
	};

	toggleDropdown = () => {
		this.setState({ dropdownVisible: !this.state.dropdownVisible });
	};

	logOut = (): Promise<void> =>
		new Promise((resolve) => {
			ActionSheetIOS.showActionSheetWithOptions(
				{
					title: 'Are you sure you want to log out?',
					options: ['Cancel', 'Logout'],
					destructiveButtonIndex: 1,
					cancelButtonIndex: 0,
				},
				async (buttonIndex): any => {
					if (buttonIndex === 1) {
						await AsyncStorage.removeItem('@now:token');
						this.setState(DEFAULT_CONTEXT, resolve);
					}
				},
			);
		});

	render() {
		return (
			<NowContext.Provider
				value={{
					...this.state,
					fetchData: this.fetchData,
					setMode: this.setMode,
					getEvents: this.getEvents,
					reloadEvents: this.reloadEvents,
					toggleDropdown: this.toggleDropdown,
					logOut: this.logOut,
					setTeam: this.setTeam,
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
