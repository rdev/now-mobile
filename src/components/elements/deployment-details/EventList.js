/* @flow */
import React from 'react';
import styled from 'styled-components';

type Props = {
	events: Zeit$Event[],
};

const View = styled.View`
	background-color: #f5f5f5;
	border-radius: 4px;
	padding: 10px;
`;

const Text = styled.Text`
	font-size: 15px;
	font-family: 'Menlo';
	color: ${({ green }) => (green ? '#12DDA0' : '#848484')};
	${({ bold, green }) => (bold || green ? 'font-weight: bold;' : '')};
`;

const Event = styled.View`
	width: 100%;
	flex-direction: column;
	margin-bottom: 10px;
	${({ last }) => {
		if (last) {
			return '';
		}
		return `
			padding-bottom: 10px;
			border-bottom-width: 1px;
			border-bottom-color: #D7D7D7;
		`;
	}};
`;

function getEventMetadata({ event, payload }: Zeit$Event) {
	if (event === 'state') {
		return <Text bold>{payload.value}</Text>;
	}

	if (event === 'instance-start' || event === 'instance-stop') {
		if (payload.dc != null) {
			return <Text green>({payload.dc})</Text>;
		}
	}

	return '';
}

export default ({ events }: Props) => (
	<View>
		{events.map((event, i) => (
			<Event key={event.id} last={i === events.length - 1}>
				<Text style={{ marginBottom: 7 }}>{new Date(event.created).toISOString()}</Text>
				<Text>
					{event.event} {getEventMetadata(event)}
				</Text>
			</Event>
		))}
	</View>
);
