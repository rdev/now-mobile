// @flow

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
	cdnEnabled: boolean,
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
	state: | 'DEPLOYING'
		| 'DEPLOYMENT_ERROR'
		| 'BOOTED'
		| 'BUILDING'
		| 'READY'
		| 'BUILD_ERROR'
		| 'FROZEN',
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

declare type Zeit$Event = {
	id: string,
	userId: string,
	ownerId: string,
	teamId: ?string,
	type: string,
	created: string,
	region: string,
	payload: {
		[string]: any, // @TODO implement ALL of this
	},
};

declare type Zeit$Events = {
	events: Zeit$Event[],
	error?: APIError,
};

declare type Zeit$Team = {
	id: string,
	slug: string,
	name: string,
	creatorId: string,
	created: string,
	avatar: ?string,
};

declare type Zeit$Teams = {
	teams: Zeit$Team[],
	error?: APIError,
};
