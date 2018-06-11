// @flow
import React from 'react';
import styled from 'styled-components';
import InstanceIcon from '../../../../assets/instance-icon.png';
import TimeAgo from '../TimeAgo';

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
	color: #b5b5b5;
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
				<MetaText>{deployment.state}</MetaText>
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
