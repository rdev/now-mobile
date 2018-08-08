/* @flow */
import React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components';
import { connect } from '../Provider';

type Props = {
	context: Context,
	navigation: Navigation,
};

type State = {
	visible: boolean,
};

const Container = Animatable.createAnimatableComponent(SafeAreaView);

const containerStyle = {
	position: 'absolute',
	left: 0,
	top: 0,
	height: 128,
	width: '100%',
	backgroundColor: '#e31f34',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
};

const Left = styled.View`
	width: 75%;
	padding-left: 15px;
`;

const Right = styled(TouchableOpacity)`
	width: 25%;
	align-items: flex-end;
	padding-right: 15px;
`;

const Text = styled.Text`
	font-weight: 300;
	font-size: 16px;
	color: white;
`;

const RetryText = styled.Text`
	font-weight: 700;
	font-size: 18px;
	color: white;
`;

@withNavigation
@connect
export default class NetworkError extends React.Component<Props, State> {
	state = {
		visible: this.props.context.networkError,
	};

	container: Animatable.View;

	componentDidUpdate = async (prevProps: Props) => {
		if (prevProps.context.networkError && !this.props.context.networkError) {
			await this.container.slideOutUp(300);
			this.setState({ visible: false }, () => {
				this.props.navigation.replace('Main');
			});
		} else if (!prevProps.context.networkError && this.props.context.networkError) {
			this.setState({ visible: true });
		}
	};

	render() {
		return this.state.visible ? (
			<Container
				animation="slideInDown"
				duration={400}
				style={containerStyle}
				ref={(ref) => {
					this.container = ref;
				}}
			>
				<Left>
					<Text>
						It seems you’re not connected to the internet. Check your connection and try
						again
					</Text>
				</Left>
				<Right activeOpacity={0.7} onPress={this.props.context.fetchData}>
					<RetryText>Retry</RetryText>
				</Right>
			</Container>
		) : null;
	}
}
