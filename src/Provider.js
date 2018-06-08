// @flow
import React from 'react';
import api from './lib/api';

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
	usage: {},
	fetchData: () => {},
};

// $FlowFixMe RN's used Flow version doesn't know about context yet
const NowContext = React.createContext(DEFAULT_CONTEXT);

export const NowConsumer = NowContext.Consumer;

export class Provider extends React.Component<*, Context> {
	state = DEFAULT_CONTEXT;

	componentDidMount = () => {
		this.fetchData();
		this.fetcher = setInterval(this.fetchData, 10 * 1000);
	}

	componentWillUnmount = () => {
		clearInterval(this.fetcher);
	}

	getUserInfo = async () => {
		const { user, error } = await api.user.vitals();

		if (error) return this.state.user;
		return user;
	}

	getDomains = async () => {
		const { domains, error } = await api.domains();

		if (error) return this.state.domains;
		return domains;
	}

	getAliases = async () => {
		const { aliases, error } = await api.aliases();

		if (error) return this.state.aliases;
		return aliases;
	}

	getUsage = async () => {
		const usage = await api.usage();

		if (usage.error) return this.state.usage;
		return usage;
	}

	fetcher: IntervalID;

	fetchData = async () => {
		const user = await this.getUserInfo();
		const domains = await this.getDomains();
		const aliases = await this.getAliases();
		const usage = await this.getUsage();

		return new Promise((resolve) => {
			this.setState({
				user,
				domains,
				aliases,
				usage,
			}, resolve);
		});
	}

	render() {
		return (
			<NowContext.Provider value={{
				...this.state,
				fetchData: this.fetchData,
			}}
			>
				{this.props.children}
			</NowContext.Provider>
		);
	}
}

export function connect(WrappedComponent: typeof React.Component | Function) {
	return (props: any) => (
		<NowConsumer>
			{context => (
				<WrappedComponent
					{...props}
					context={context}
				/>
			)}
		</NowConsumer>
	);
}
