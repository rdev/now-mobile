// @flow
import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components';
import api from '../lib/api';
import { connect } from '../Provider';
import LoadingIndicator from '../components/elements/deployment-details/LoadingIndicator';
import Details from '../components/elements/deployment-details/Details';

type State = {
	data: any,
};

type Props = {
	navigation: Navigation,
	context: Context,
};

const Container = styled(SafeAreaView)`
	height: 100%;
	width: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: white;
`;

/**
 * Individual deployment details view
 *
 * @export
 * @class DeploymentDetails
 * @extends {React.Component}
 */
@connect
export default class DeploymentDetails extends Component<Props, State> {
	state = {
		data: null,
	};

	componentDidMount = () => {
		this.loadDetails();
	};

	loadDetails = async () => {
		const id = this.props.navigation.getParam('id');
		const type = this.props.navigation.getParam('type');
		const data = await api.deploymentDetails(id, type);

		this.setState({ data });
	};

	render() {
		const { data } = this.state;

		return (
			<Container>
				<ScrollView
					contentContainerStyle={{
						paddingHorizontal: '5%',
					}}
					style={{
						width: '100%',
					}}
					scrollEnabled={!!data}
				>
					{data ? (
						<Details
							scale={data.scale}
							deployment={data.deployment}
							events={data.events}
						/>
					) : (
						<LoadingIndicator />
					)}
				</ScrollView>
			</Container>
		);
	}
}
