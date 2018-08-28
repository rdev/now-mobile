// @flow

// API Response types

declare type APIError = {
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

declare type Zeit$PlanName =
	| 'oss'
	| 'free'
	| 'premium'
	| 'pro'
	| 'advanced'
	| 'on-demand'
	| 'unlimited';

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
	mode: Zeit$PlanName,
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
		// V3 API
		sfo1: {
			current: number,
			min: number,
			max: number,
		},
		bru1: {
			current: number,
			min: number,
			max: number,
		},
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
	event: string,
	user?: Zeit$User,
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

declare type Zeit$NewTeam = {
	id: string,
	error?: APIError,
};

declare type Zeit$DeleteTeam = {
	id: string,
	error?: APIError,
};

declare type Zeit$Instance = {
	uid: string,
	url: string,
};

declare type Zeit$Scale = {
	bru1: { instances: Zeit$Instance[] },
	sfo1: { instances: Zeit$Instance[] },
};

declare type Zeit$DeploymentDetails = {
	deployment: Zeit$Deployment,
	scale: Zeit$Scale,
	events: ?(Zeit$Event[]),
};
