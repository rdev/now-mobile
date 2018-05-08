// @flow

declare type Navigation = {
	push: (path: string) => void,
	replace: (path: string) => void,
}

declare type Method = 'get' | 'GET' | 'post' | 'POST';

declare type RequestOptions = {
	body?: {
		[string]: any,
	},
	team?: string,
};

// API Response types

type APIError = {
	code: string,
	message: string,
}

declare type Zeit$Preauth = {
	token: string,
	securityCode: string,
	error?: APIError
}

declare type Zeit$Auth = {
	token: string,
	error?: APIError
}

declare type Zeit$User = {
	uid: string,
	email: string,
	username: string,
	date: ? string,
	billingChecked: boolean,
	avatar: string,
	github: boolean,
}

declare type Zeit$Vitals = {
	user: Zeit$User,
	error?: APIError
}

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
	certs: string[]
}

declare type Zeit$Domains = {
	domains: Zeit$Domain[],
	error?: APIError
}

declare type Context = {
	user: Zeit$User,
	domains: Zeit$Domain[],
}
