/* @flow */
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { platformBlackColor } from '../lib/utils';
import pkg from '../../package.json';

type Props = {
	navigation: Navigation,
};

const containerStyle = {
	paddingBottom: 50,
	paddingHorizontal: '10%',
	alignItems: 'center',
	justifyContent: 'center',
};

const View = styled.SafeAreaView`
	background-color: #ffffff;
	height: 100%;
`;

const Title = styled.Text`
	font-weight: 700;
	font-size: 18px;
	color: ${platformBlackColor};
	margin-top: 40%;
	margin-bottom: 20px;
`;

const Version = styled.Text`
	color: #cacaca;
	font-size: 16px;
	margin-bottom: 35px;
`;

const Text = styled.Text`
	font-size: 16px;
	color: ${platformBlackColor};
`;

const Button = styled.Text`
	font-size: 15px;
	color: #cacaca;
	margin-top: 25px;
`;

export default ({ navigation }: Props) => {
	const description = navigation.getParam('description');

	// Should never happen, but just in case
	if (!description) {
		navigation.goBack();
		return null;
	}

	return (
		<View>
			<ScrollView contentContainerStyle={containerStyle}>
				<Title>What’s New</Title>
				<Version>{`v${pkg.version} r${pkg.update}`}</Version>
				<Text>{description}</Text>
				<TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
					<Button>Dismiss</Button>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};
