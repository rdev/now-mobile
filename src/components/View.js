import React from 'react';
import styled from 'styled-components';
import History from './views/History';
import Deployments from './views/Deployments';
import Aliases from './views/Aliases';
import Domains from './views/Domains';
import Usage from './views/Usage';

const Wrapper = styled.View``;

// Add paddings
const wrap = Component => <Wrapper>{Component}</Wrapper>;

export default ({ name }) => {
	switch (name) {
		case 'History':
			return wrap(<History />);
		case 'Deployments':
			return wrap(<Deployments />);
		case 'Aliases':
			return wrap(<Aliases />);
		case 'Domains':
			return wrap(<Domains />);
		case 'Usage':
			return wrap(<Usage />);
		default:
			return null;
	}
};
