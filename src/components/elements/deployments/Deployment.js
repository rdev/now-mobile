// @flow
import React from 'react';
import styled from 'styled-components';
import InstanceIcon from '../../../../assets/instance-icon.png';
import TimeAgo from '../TimeAgo';
import { platformBlackColor } from '../../../lib/utils';

type Props = {
	deployment: Zeit$Deployment,
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

const Metadata = styled.View`
	flex-direction: row;
	align-items: center;
	margin-top: 10px;
`;

const Image = styled.Image`
	height: 14px;
	width: 18px;
	margin-right: 10px;
`;

const MetaGroup = styled.View`
	flex-direction: row;
	align-items: center;
`;

const MetaText = styled.Text`
	color: ${({ state }) =>
		(state === 'BUILD_ERROR' || state === 'DEPLOYMENT_ERROR' ? '#D74C58' : '#B5B5B5')};
	font-size: 16px;
	font-weight: 300;
`;

export default ({ deployment }: Props) => (
	<View>
		<Address>{deployment.url}</Address>
		<Metadata>
			{(() => {
				if (deployment.scale) {
					return (
						<MetaGroup style={{ paddingRight: 10 }}>
							<Image source={InstanceIcon} />
							<MetaText>{deployment.scale.current}</MetaText>
						</MetaGroup>
					);
				}
				return null;
			})()}
			<MetaGroup
				style={{
					borderRightWidth: 1,
					borderRightColor: '#EAEAEA',
					borderLeftWidth: deployment.scale ? 1 : 0,
					borderLeftColor: '#EAEAEA',
					paddingLeft: deployment.scale ? 10 : 0,
					paddingRight: 10,
				}}
			>
				<MetaText state={deployment.state}>{deployment.state}</MetaText>
			</MetaGroup>
			<MetaGroup
				style={{ borderLeftWidth: 0.5, borderLeftColor: '#EAEAEA', paddingLeft: 10 }}
			>
				<MetaText>
					<TimeAgo date={deployment.created} />
				</MetaText>
			</MetaGroup>
		</Metadata>
	</View>
);
