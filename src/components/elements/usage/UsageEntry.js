import React from 'react';
import styled from 'styled-components';

const View = styled.View`
	flex-direction: column;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const Numbers = styled.View`
	flex-direction: row;
	align-items: center;
`;

const Usage = styled.Text`
	font-weight: 100;
	font-size: 40px;
	letter-spacing: 0.5px;
`;

const Max = styled.Text`
	font-size: 22px;
	color: #848484;
	font-weight: 200;
	margin-left: 10px;
`;

const Title = styled.Text`
	font-size: 17px;
	font-weight: 300;
	margin-top: 5px;
`;

const Separator = styled.View`
	height: 1px;
	border-bottom-color: #EAEAEA;
	border-bottom-width: 1px;
	margin-vertical: 20px;
	width: 50%;
`;

export default ({ usage, max, name }) => (
	<View>
		<Numbers>
			<Usage>{usage}</Usage>
			<Max>/ {max}</Max>
		</Numbers>
		<Title>{name}</Title>
		{name !== 'Logs' && <Separator />}
	</View>
);
