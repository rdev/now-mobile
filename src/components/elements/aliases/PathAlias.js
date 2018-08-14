// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { platformBlackColor, isAndroid, promptOpen } from '../../../lib/utils';
import GoIcon from '../../../../assets/go.png';

type Props = {
	pathname?: string,
	dest: string,
};

const View = styled.View`
	flex-direction: column;
	padding-vertical: 10px;
`;

const Address = styled.Text`
	font-size: 16px
	font-weight: 300;
	color: ${platformBlackColor};
`;

const Path = styled.Text`
	margin-top: 2px;
	font-size: 16px;
	font-weight: 300;
	color: #b5b5b5;
`;

const TitleWrap = styled.View`
	flex-direction: row;
	align-items: ${isAndroid ? 'flex-start' : 'baseline'};
`;

const Go = styled.Image`
	width: 15px;
	height: 14px;
	margin-left: 10px;
	margin-top: ${isAndroid ? '4px' : 0};
`;

export default ({ pathname = '*', dest }: Props) => (
	<View>
		<TouchableOpacity activeOpacity={0.6} onPress={() => promptOpen(dest)}>
			<TitleWrap>
				<Address>{dest}</Address>
				<Go source={GoIcon} />
			</TitleWrap>
		</TouchableOpacity>
		<Path>{pathname}</Path>
	</View>
);
