/* @flow */
import React from 'react';
import styled from 'styled-components';

type Props = {
	scale: Zeit$Scale,
	deployment: Zeit$Deployment,
};

const Table = styled.View`
	flex-direction: column;
	width: 100%;
	margin-bottom: 20px;
`;

const Row = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 7px;
`;

const Item = styled.View`
	width: 25%;
	${({ first }) => (first ? '' : 'align-items: center;')};
`;

const Text = styled.Text`
	font-size: 16px
	font-weight: ${({ heading }) => (heading ? '700' : '300')};
	color: ${props => props.theme.text};
`;

export default ({ scale, deployment }: Props) => (
	<Table>
		<Row>
			<Item first>
				<Text heading>dc</Text>
			</Item>
			<Item>
				<Text heading>min</Text>
			</Item>
			<Item>
				<Text heading>max</Text>
			</Item>
			<Item>
				<Text heading>current</Text>
			</Item>
		</Row>
		{(() => {
			const rows = [];

			Object.keys(scale).forEach((dc) => {
				const { instances } = scale[dc];
				const cfg = deployment.scale[dc] || {};

				const row = (
					<Row key={dc}>
						<Item first>
							<Text>{dc}</Text>
						</Item>
						<Item>
							<Text>{cfg.min || 0}</Text>
						</Item>
						<Item>
							<Text>{cfg.max || 0}</Text>
						</Item>
						<Item>
							<Text>{instances.length}</Text>
						</Item>
					</Row>
				);

				rows.push(row);
			});

			return rows;
		})()}
	</Table>
);
