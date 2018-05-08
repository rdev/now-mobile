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
};

// $FlowFixMe
const NowContext = React.createContext(DEFAULT_CONTEXT);

export const NowConsumer = NowContext.Consumer;

export class Provider extends React.Component<*, Context> {
	state = DEFAULT_CONTEXT;

	componentDidMount = () => {
		this.fetchNewData();
		this.fetcher = setInterval(this.fetchNewData, 10 * 1000);
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

	fetcher: IntervalID;

	fetchNewData = async () => {
		const user = await this.getUserInfo();
		const domains = await this.getDomains();

		this.setState({
			user,
			domains,
		});
	}

	render() {
		return (
			<NowContext.Provider value={this.state}>
				{this.props.children}
			</NowContext.Provider>
		);
	}
}

export function connect(WrappedComponent: typeof React.Component | Function) {
	return (props: any) => (
		<NowConsumer>
			{context => <WrappedComponent {...props} context={context} />}
		</NowConsumer>
	);
}
