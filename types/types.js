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
};

// API Response types

type APIError = {
	code: string,
	message: string,
};

declare type Zeit$Preauth = {
	token: string,
	securityCode: string,
	error?: APIError,
};

declare type Zeit$Auth = {
	token: string,
	error?: APIError,
};

declare type Zeit$User = {
	uid: string,
	email: string,
	username: string,
	date: ?string,
	billingChecked: boolean,
	avatar: string,
	github: boolean,
};

declare type Zeit$Vitals = {
	user: Zeit$User,
	error?: APIError,
};

declare type Zeit$Domain = {
	uid: string,
	name: string,
	created: string,
	boughtAt: ?string,
	expiresAt: ?string,
	isExternal: boolean,
	serviceType: string,
	verified: boolean,
	aliases: string[],
	certs: string[],
};

declare type Zeit$Domains = {
	domains: Zeit$Domain[],
	error?: APIError,
};

declare type Zeit$AliasRule = {
	pathname?: string,
	dest: string,
};

declare type Zeit$Alias = {
	uid: string,
	created: string,
	alias: string,
	deployment: {
		id: string,
		url: string,
	},
	deploymentId: string,
	rules?: Zeit$AliasRule[],
};

declare type Zeit$Aliases = {
	aliases: Zeit$Alias[],
	error?: APIError,
};

declare type Zeit$Usage = {
	metrics: {
		activeDeployments: number,
		activeInstances: number,
		aliases: number,
		domains: number,
		logs: {
			count: number,
			size: number,
		},
		bandwidth: {
			rx: number,
			tx: number,
		},
		startTime: string,
	},
	mode: 'oss' | 'free' | 'premium' | 'pro' | 'advanced' | 'on-demand' | 'unlimited',
	error?: APIError,
};

declare type Zeit$Deployment = {
	uid: string,
	name: string,
	url: ?string,
	created: string,
	creator: {
		uid: 'string',
	},
	state: 'DEPLOYING' | 'DEPLOYMENT_ERROR' | 'BOOTED' | 'BUILDING' | 'READY' | 'BUILD_ERROR' | 'FROZEN',
	type: 'NPM' | 'DOCKER' | 'STATIC',
	scale: {
		current: number,
		min: number,
		max: number,
	},
};

declare type Zeit$Deployments = {
	deployments: Zeit$Deployment[],
	error?: APIError,
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
	deployments: Zeit$Deployment[], // @FIXME There's definitely a better way to do it
	fetchData: () => void,
};
