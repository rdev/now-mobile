// @flow
import * as auth from './actions/auth';
import * as user from './actions/user';
import domains from './actions/domains';
import aliases from './actions/aliases';
import usage from './actions/usage';
import { deployments, deploymentDetails } from './actions/deployments';
import events from './actions/events';
import * as teams from './actions/teams';

export default {
	auth,
	user,
	domains,
	aliases,
	usage,
	deployments,
	deploymentDetails,
	events,
	teams,
};
