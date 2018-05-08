// @flow
import React, { Component } from 'react';
import { TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import View from '../components/View';
import Header from '../components/Header';
import { viewport } from '../lib/utils';

/* eslint-disable react/no-unused-prop-types */
type Slide = {
	item: string,
	index: number,
}
/* eslint-enable react/no-unused-prop-types */

const Container = styled(SafeAreaView)`
	width: 100%;
	flex: 1;
	flex-direction: column;
	background-color: white;
`;

const Title = styled.Text`
	font-size: 26px;
	font-weight: 800;
	margin-bottom: 20px;
	padding-left: 7%;
	letter-spacing: 0.6px;
	height: 36px;
	width: 100%;
`;

const VIEWS = [
	'History',
	'Deployments',
	'Aliases',
	'Domains',
	'Usage',
];

export default class Main extends Component<{}, {}> {
	static renderView({ item, index }: Slide) {
		return <View key={index} name={item} />;
	}

	titleSlider: Carousel;
	viewSlider: Carousel;

	renderTitle = ({ item, index }: Slide) => (
		<TouchableWithoutFeedback onPress={() => {
			this.titleSlider.snapToItem(index);
			this.viewSlider.snapToItem(index);
		}}
		>
			<Title key={index}>{item}</Title>
		</TouchableWithoutFeedback>
	)

	render() {
		return (
			<Container>
				<Animatable.View animation="fadeIn" duration={600} style={{ width: '100%' }}>
					<Header />
					<Carousel
						ref={(ref) => { this.titleSlider = ref; }}
						data={VIEWS}
						renderItem={this.renderTitle}
						sliderWidth={viewport.width}
						sliderHeight={36}
						itemWidth={viewport.width * 0.8}
						itemHeight={36}
						inactiveSlideScale={1}
						inactiveSlideOpacity={0.15}
						activeSlideAlignment="start"
						onSnapToItem={index => this.viewSlider.snapToItem(index)}
					/>
					<Carousel
						ref={(ref) => { this.viewSlider = ref; }}
						data={VIEWS}
						renderItem={Main.renderView}
						sliderWidth={viewport.width}
						sliderHeight={36}
						itemWidth={viewport.width}
						itemHeight={36}
						inactiveSlideScale={1}
						inactiveSlideOpacity={0}
						activeSlideAlignment="start"
						onSnapToItem={index => this.titleSlider.snapToItem(index)}
					/>
				</Animatable.View>
			</Container>
		);
	}
}
