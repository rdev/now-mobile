// @flow
import React, { Component } from 'react';
import { TouchableWithoutFeedback, SafeAreaView, PushNotificationIOS } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import PushNotification from 'react-native-push-notification';
import View from '../components/View';
import Header from '../components/Header';
import Dropdown from '../components/Dropdown';
import { viewport, platformBlackColor, isAndroid } from '../lib/utils';
import setUpBackgroundTask from '../lib/background-task';

type Props = {
	navigation: Navigation,
	context: Context,
};

/* eslint-disable react/no-unused-prop-types */
type Slide = {
	item: string,
	index: number,
};
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
	color: ${platformBlackColor};
`;

// There's a limited number of views, all of which we know,
// so let's just put them in an array for carousels to use
const VIEWS = ['History', 'Deployments', 'Aliases', 'Domains', 'Usage'];

/**
 * Main screen component
 *
 * @export
 * @class Main
 * @extends {React.Component}
 */
export default class Main extends Component<Props> {
	/**
	 * Carousels use this function to render a view
	 *
	 * @static
	 * @param {Slide} slide - Slide object containing a string name for view and an index
	 * @returns {View}
	 * @memberof Main
	 */
	static renderView({ item, index }: Slide) {
		return <View key={index} name={item} />;
	}

	componentDidMount = async () => {
		setUpBackgroundTask();
		PushNotification.configure({
			onNotification: (notification) => {
				if (notification.userInteraction) {
					this.titleSlider.snapToItem(4);
					this.viewSlider.snapToItem(4);
				}
				notification.finish(PushNotificationIOS.FetchResult.NoData);
			},
			requestPermissions: true,
		});
		if (!isAndroid) {
			const Spotlight = require('../extensions/spotlight');
			Spotlight.addListener(this.handleSpotlightClick);

			// If app was opened from Spotlight and we're coming from splash screen, send user to deployment screen right away
			const fromSplash = this.props.navigation.getParam('fromSplash');
			if (fromSplash) {
				const id = await Spotlight.handleAppOpen();
				this.props.navigation.push('DeploymentDetails', { id });
			}
		}
	};

	componentWillUnmount = () => {
		if (!isAndroid) {
			const Spotlight = require('../extensions/spotlight');
			Spotlight.removeListener(this.handleSpotlightClick);
		}
	};

	titleSlider: Carousel;
	viewSlider: Carousel;

	/**
	 *
	 * @param {string} id - Deployment ID of the Spotlight item
	 * @returns {TouchableWithoutFeedback}
	 * @memberof Main
	 */
	handleSpotlightClick = (id: string) => {
		this.props.navigation.push('DeploymentDetails', { id });
	};

	/**
	 *
	 * @param {Slide} slide - Slide object containing a string name for view and an index
	 * @returns {TouchableWithoutFeedback}
	 * @memberof Main
	 */
	renderTitle = ({ item, index }: Slide) => (
		<TouchableWithoutFeedback
			onPress={() => {
				this.titleSlider.snapToItem(index);
				this.viewSlider.snapToItem(index);
			}}
		>
			<Title key={index}>{item}</Title>
		</TouchableWithoutFeedback>
	);

	/*
	 * Okay, I feel like I need to address this carousel chaos
	 *
	 * There are two separate carousels for the titles and the actual views
	 * They are independent from each other but once one of them snaps to a "slide"
	 * it's gonna snap the other one to it. I didn't figure out a nice way to do
	 * simultaneous swiping that's simple and performant, and this module comes with some
	 * cool stuff like gradual transitions (check out opacity when scrolling), so I'm using it
	 * till a better option is found
	 */
	render() {
		return (
			<Container>
				<Animatable.View animation="fadeIn" duration={600} style={{ width: '100%' }}>
					{/* $FlowFixMe */}
					<Header />
					{/* Titles carousel */}
					<Carousel
						ref={(ref) => {
							this.titleSlider = ref;
						}}
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
					{/* Views carousel */}
					<Carousel
						ref={(ref) => {
							this.viewSlider = ref;
						}}
						data={VIEWS}
						renderItem={Main.renderView}
						sliderWidth={viewport.width}
						itemWidth={viewport.width}
						slideStyle={{ flex: 1 }}
						containerCustomStyle={{ height: viewport.height - 40 - 36 - 100 }}
						inactiveSlideScale={1}
						inactiveSlideOpacity={0}
						activeSlideAlignment="start"
						onSnapToItem={index => this.titleSlider.snapToItem(index)}
					/>
					{/* $FlowFixMe */}
					<Dropdown />
				</Animatable.View>
			</Container>
		);
	}
}
