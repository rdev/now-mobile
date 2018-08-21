// @flow
import React from 'react';
import styled from 'styled-components';
import { platformBlackColor } from '../../../lib/utils';
import TimeAgo from '../TimeAgo';
import PathAlias from './PathAlias';

type Props = {
	alias: Zeit$Alias,
	last: boolean,
};

const View = styled.View`
	flex-direction: column;
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

const Group = styled.View`
	flex-direction: column;
	padding-left: 20px;
`;

const TitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.Text`
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 5px;
	color: ${platformBlackColor};
`;

export default ({ alias, last }: Props) => (
	<View last={last}>
		<TitleWrap>
			<Title>{alias.alias}</Title>
			<TimeAgo date={alias.created} />
		</TitleWrap>
		<Group>
			{/* $FlowFixMe rules is not undefined if this is being rendered */}
			{alias.rules.map(({ pathname, dest }, i) => (
				<PathAlias
					pathname={pathname}
					dest={dest}
					key={`${alias.uid}_${pathname || i}_${dest}`}
				/>
			))}
		</Group>
	</View>
);
