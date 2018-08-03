/* @flow */
import React from 'react';
import styled from 'styled-components';

type Props = {
	children: any,
	viewName: string,
};

type State = {
	hasError: boolean,
	// error: any,
	// errorInfo: any,
};

const Error = styled.View`
	padding-horizontal: 6%;
	margin-top: 28px;
	align-items: center;
	justify-content: center;
`;

const ErrorMessage = styled.Text`
	font-size: 16px;
	font-weight: 300;
	color: #848484;
`;

// @TODO I feel like some kind of error reporting is necessary after all
export default class ErrorBoundary extends React.Component<Props, State> {
	state = {
		hasError: false,
		// error: null,
		// errorInfo: null,
	};

	componentDidCatch(error: any, errorInfo: any) {
		this.setState({
			hasError: true,
			// error,
			// errorInfo,
		});
		console.log(JSON.stringify(error, null, 2));
		console.log(errorInfo.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Error>
					<ErrorMessage>
						Something went wrong while loading {this.props.viewName}
					</ErrorMessage>
				</Error>
			);
		}
		return this.props.children;
	}
}
