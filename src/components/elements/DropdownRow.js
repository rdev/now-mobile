// @flow
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import styled from 'styled-components';
import plusImage from '../../../assets/plus.png';

type Props = {
	bold?: boolean,
	image?: string,
	plus?: boolean,
	text: string,
	padded?: boolean,
	border?: 'top' | 'bottom',
	active?: boolean,
	onPress?: Function,
};

const Row = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-horizontal: 22px;
	width: 100%;
	${({ border }) => {
		if (border === 'top') {
			return `
				border-top-width: 1px;
				border-top-color: #EAEAEA;
			`;
		}

		if (border === 'bottom') {
			return `
				border-bottom-width: 1px;
				border-bottom-color: #EAEAEA;
			`;
		}

		return '';
	}};
`;

const ImageContainer = styled.View`
	height: 36px;
	width: 36px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
	margin-right: 10px;
`;

const MainArea = styled.View`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const Text = styled.Text`
	font-size: 17px;
	font-weight: ${({ bold }) => (bold ? 800 : 300)};
	color: ${({ bold }) => (bold ? 'black' : '#848484')};
`;

const Plus = styled.View`
	height: 20px;
	width: 20px;
`;

const DropdownRow = ({
	bold, image, plus, text, padded, border, active, onPress,
}: Props) => (
	<TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress}>
		{/* This style prop is damn dirty but it looks meh otherwise */}
		<Row
			style={bold ? { paddingTop: 10 } : { paddingVertical: padded ? 17 : 12 }}
			border={border}
		>
			<MainArea>
				{image ? (
					<ImageContainer>
						<CachedImage
							source={{ uri: image }}
							style={{ width: '100%', height: '100%' }}
							resizeMode="contain"
						/>
					</ImageContainer>
				) : null}
				<Text bold={bold || active}>{text}</Text>
			</MainArea>
			{plus ? (
				<Plus>
					<Image
						source={plusImage}
						style={{ width: '100%', height: '100%' }}
						resizeMode="contain"
					/>
				</Plus>
			) : null}
		</Row>
	</TouchableOpacity>
);

DropdownRow.defaultProps = {
	bold: false,
	image: undefined,
	plus: false,
	padded: false,
	active: false,
	border: undefined,
	onPress: undefined,
};

export default DropdownRow;
