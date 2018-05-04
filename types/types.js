// @flow

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
	token?: string,
	securityCode?: string,
	error?: APIError
}

declare type Zeit$Auth = {
	token?: string,
	error?: APIError
}

declare type Zeit$Vitals = {
	user?: {
		uid: string,
		email: string,
		username: string,
		date: ?string,
		billingChecked: boolean,
		avatar: string,
		github: boolean,
	},
	error?: APIError
}
