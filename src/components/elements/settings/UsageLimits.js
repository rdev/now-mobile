// @flow
import React from 'react';
import { AsyncStorage } from 'react-native';
import styled from 'styled-components';
import Separator from './Separator';
import SettingsRow from './SettingsRow';
import RowText from './RowText';
import UsageLimitInput from './UsageLimitInput';

type Props = {
	usage: any | Zeit$Usage,
};

type State = {
	instanceLimit: string,
	bandwidthLimit: string,
	logsLimit: string,
};


const SectionHeading = styled.Text`
	font-size: 18px
	font-weight: 700;
	color: ${props => props.theme.text};
	width: 80%;
	margin-bottom: 15px;
`;

class UsageLimits extends React.Component<Props, State> {
	state = {
		instanceLimit: '0',
		bandwidthLimit: '0',
		logsLimit: '0',
	};

	componentDidMount = () => {
		this.getUsageLimits();
	};

	getUsageLimits = async () => {
		const instanceLimit =
			(await AsyncStorage.getItem('@now:instanceLimit')) || this.state.instanceLimit;
		const bandwidthLimit =
			(await AsyncStorage.getItem('@now:bandwidthLimit')) || this.state.bandwidthLimit;
		const logsLimit = (await AsyncStorage.getItem('@now:logsLimit')) || this.state.logsLimit;

		this.setState({
			instanceLimit,
			bandwidthLimit,
			logsLimit,
		});
	};

	setLimit = async (value: string, type: 'instanceLimit' | 'bandwidthLimit' | 'logsLimit') => {
		let limit = value.replace(/\D/g, '');
		if (limit.length > 0 && limit.substr(0, 1) === '0') {
			limit = limit.slice(1);
		}
		if (limit === '') {
			limit = '0';
		}

		await AsyncStorage.setItem(`@now:${type}`, limit);
		this.setState({ [type]: limit });
	};

	render() {
		const { usage } = this.props;

		if (usage.mode === 'on-demand' || usage.mode === 'unlimited') {
			return (
			// $FlowFixMe
				<React.Fragment>
					<Separator />
					<SectionHeading>Usage limits</SectionHeading>
					<SettingsRow>
						<RowText>Instances</RowText>
						<UsageLimitInput
							value={this.state.instanceLimit}
							onChangeText={(val: string) => {
								this.setLimit(val, 'instanceLimit');
							}}
						/>
					</SettingsRow>
					<SettingsRow>
						<RowText>Bandwidth</RowText>
						<UsageLimitInput
							value={this.state.bandwidthLimit}
							onChangeText={(val: string) => {
								this.setLimit(val, 'bandwidthLimit');
							}}
							label
						/>
					</SettingsRow>
					<SettingsRow style={{ height: 40 }}>
						<RowText>Logs</RowText>
						<UsageLimitInput
							value={this.state.logsLimit}
							onChangeText={(val: string) => {
								this.setLimit(val, 'logsLimit');
							}}
							label
						/>
					</SettingsRow>
				</React.Fragment>
			);
		}
		return null;
	}
}

export default UsageLimits;
