/* @flow */
import React from 'react';
import styled from 'styled-components';

const EmtpyContainer = styled.View`
	padding-horizontal: 6%;
	margin-top: 28px;
	align-items: center;
	justify-content: center;
`;

const EmtpyMessage = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: #848484;
`;

const EmptyResults = (props: { viewName: string }) => (
	<EmtpyContainer>
		<EmtpyMessage>No {props.viewName} to show</EmtpyMessage>
	</EmtpyContainer>
);

export default EmptyResults;
