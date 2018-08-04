// @flow
// @TODO I feel like this component is becoming way too gigantic and something needs to be improoved

import React from 'react';
import { AsyncStorage, ActionSheetIOS, Platform, Alert } from 'react-native';
import TouchID from 'react-native-touch-id';
import * as watch from 'react-native-watch-connectivity';
import qs from 'query-string';
import api from './lib/api';
import { isAndroid } from './lib/utils';
import messages from './components/elements/history/messages';
import * as SharedGroup from './extensions/today';

type EventTypes = {
	system: Set<string>,
	me: Set<string>,
	team: Set<string>,
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
	logOut: () => {},
	setTeam: () => {},
	createTeam: () => '',
	sendTokenToWatch: () => {},
	dropdownVisible: false,
	networkError: false,
	watchIsReachable: false,
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
			team: new Set(manual), // @TODO There should be a better way to do this
		};
	};

	state = DEFAULT_CONTEXT;

	componentDidMount = () => {
		this.fetchData();
		this.detectBiometry();
		if (!isAndroid) this.setUpWatchConnectivity();
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

		SharedGroup.saveUsage(usage);

		return usage;
	};

	getDeployments = async (): Promise<Zeit$Deployment[]> => {
		const { deployments, error } = await api.deployments();

		if (error) return this.state.deployments;

		if (!isAndroid) {
			require('./extensions/spotlight').indexDeployments(deployments);
		}

		SharedGroup.saveDeployments(deployments);

		return deployments;
	};

	getEvents = async (until?: string): Promise<Zeit$Event[]> => {
		const types = Provider.getEventTypes();
		const query = {
			until: until || new Date().toISOString(),
			limit: 25,
			types: Array.from(types[this.state.mode]).join(','),
			teamId: this.state.team ? this.state.team.id : undefined,
			userId: this.state.team && this.state.mode === 'me' ? this.state.user.uid : '',
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

	createTeam = (slug: string): Promise<string> =>
		new Promise(async (resolve, reject) => {
			const { id, error } = await api.teams.createTeam(slug);

			if (error) {
				reject(error);
			} else {
				const teams = await this.getTeams();

				this.setState({ teams });
				resolve(id);
			}
		});

	setMode = (mode: 'me' | 'system' | 'team'): Promise<void> =>
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

			if (team) {
				await AsyncStorage.setItem('@now:teamId', team.id);
			} else {
				await AsyncStorage.removeItem('@now:teamId');
			}

			this.setState({ team, mode: 'me' }, async () => {
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
			console.log('FETCHING DATA');
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
			if (isAndroid) {
				Alert.alert(
					'Are you sure you want to log out?',
					null,
					[
						{ text: 'Cancel', onPress: () => {} },
						{
							text: 'Log Out',
							onPress: async () => {
								await this.handleLogout();
								resolve();
							},
						},
					],
					{ cancelable: false },
				);
			} else {
				ActionSheetIOS.showActionSheetWithOptions(
					{
						title: 'Are you sure you want to log out?',
						options: ['Cancel', 'Logout'],
						destructiveButtonIndex: 1,
						cancelButtonIndex: 0,
					},
					async (buttonIndex): any => {
						if (buttonIndex === 1) {
							await this.handleLogout();
							resolve();
						}
					},
				);
			}
		});

	handleLogout = (): Promise<void> =>
		new Promise(async (resolve) => {
			await AsyncStorage.removeItem('@now:token');
			await AsyncStorage.removeItem('@now:touchId');
			SharedGroup.clearDeployments();
			SharedGroup.clearUsage();

			if (!isAndroid) {
				watch.updateApplicationContext({});
				require('./extensions/spotlight').clear();
			}

			this.setState(DEFAULT_CONTEXT, resolve);
		});

	detectBiometry = async () => {
		try {
			const type = await TouchID.isSupported();
			this.setState({ biometry: type === 'FaceID' ? 'face' : 'touch' });
		} catch (e) {
			console.log('BIOMETRY NOT SUPPORTED', e);
		}
	};

	sendTokenToWatch = async () => {
		if (Platform.OS !== 'ios') return;

		const token = await AsyncStorage.getItem('@now:token');
		watch.updateApplicationContext(token ? { token } : {});
	};

	setUpWatchConnectivity = () => {
		watch.getWatchReachability((err, watchIsReachable) => {
			this.setState({ watchIsReachable });
		});
		watch.subscribeToWatchReachability((err, watchIsReachable) => {
			if (!err) {
				this.setState({ watchIsReachable });

				if (watchIsReachable) {
					this.sendTokenToWatch();
				}
			}
		});
		watch.getWatchState((err, watchState) => {
			if (!err && watchState === 'Activated') {
				this.sendTokenToWatch();
			}
		});
		watch.subscribeToWatchState((err, watchState) => {
			if (!err && watchState === 'Activated') {
				this.sendTokenToWatch();
			}
		});
	};

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
					createTeam: this.createTeam,
					sendTokenToWatch: this.sendTokenToWatch,
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
