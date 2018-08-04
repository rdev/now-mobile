// @flow
import React from 'react';
import styled from 'styled-components';
import TimeAgo from '../TimeAgo';
import { platformBlackColor } from '../../../lib/utils';
import ExpireDate from './ExpireDate';

type Props = {
	domain: Zeit$Domain,
	last: boolean,
};

const View = styled.View`
	flex-direction: row;
	padding-vertical: 15px;
	${({ last }) => {
		if (last) {
			return '';
		}
		return `
			border-bottom-width: 1px;
			border-bottom-color: #EAEAEA;
		`;
	}};
`;

const LeftSide = styled.View`
	flex-direction: column;
	flex: 1;
`;

const Metadata = styled.View`
	flex-direction: row;
	align-items: center;
`;

const MetaText = styled.Text`
	color: ${({ enabled }) => (enabled ? 'black' : '#B5B5B5')};
	font-size: 16px;
	font-weight: 300;
`;

const MetaGroup = styled.View`
	flex-direction: row;
	align-items: center;
`;

const Title = styled.Text`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 5px;
	color: ${platformBlackColor()};
`;

export default ({ domain, last }: Props) => (
	<View last={last}>
		<LeftSide>
			<Title>{domain.name}</Title>
			<Metadata>
				<MetaGroup
					style={{
						borderRightWidth: 0.5,
						borderRightColor: '#EAEAEA',
						paddingRight: 10,
						marginRight: 10,
					}}
				>
					<MetaText enabled={domain.enabled}>
						{domain.enabled ? 'CDN: On' : 'CDN: Off'}
					</MetaText>
				</MetaGroup>
				<ExpireDate date={domain.expiresAt} />
			</Metadata>
		</LeftSide>
		<TimeAgo date={domain.created} />
	</View>
);
