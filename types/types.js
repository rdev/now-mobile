// @flow

declare type Navigation = {
	push: (path: string) => void,
	replace: (path: string) => void,
};

declare type Method = 'get' | 'GET' | 'post' | 'POST';

declare type RequestOptions = {
	body?: {
		[string]: any,
	},
	team?: string,
	endpoint?: string,
	query?: string,
};

declare type Plan = {
	bandwidth: number,
	logs: number,
	concurrentInstances: number,
	domains: number,
};

declare type Context = {
	user: any | Zeit$User, // @FIXME There's definitely a better way to do it
	domains: Zeit$Domain[],
	aliases: Zeit$Alias[],
	usage: any | Zeit$Usage, // @FIXME There's definitely a better way to do it
	deployments: Zeit$Deployment[],
	events: Zeit$Event[],
	mode: 'me' | 'system',
	team: any, // @TODO
	refreshing: boolean,
	fetchData: () => void,
	setMode: (mode: string) => void,
	getEvents: (since: string) => Zeit$Event[],
	reloadEvents: (showIndicator?: boolean) => void,
};
