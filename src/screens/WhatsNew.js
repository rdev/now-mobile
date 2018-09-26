/* @flow */
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
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
	background-color: ${props => props.theme.background};
	height: 100%;
`;

const Title = styled.Text`
	font-weight: 700;
	font-size: 18px;
	color: ${props => props.theme.text};
	margin-top: 40%;
	margin-bottom: 20px;
`;

const Version = styled.Text`
	color: ${props => props.theme.whatsNewText};
	font-size: 16px;
	margin-bottom: 35px;
`;

const Text = styled.Text`
	font-size: 16px;
	color: ${props => props.theme.text};
`;

const Button = styled.Text`
	font-size: 15px;
	color: ${props => props.theme.whatsNewText};
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
