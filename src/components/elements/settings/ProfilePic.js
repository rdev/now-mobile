import styled from 'styled-components';
import { isIphoneSE } from '../../../lib/utils';

const ProfilePic = styled.View`
	height: 128px;
	width: 128px;
	border-radius: 100px;
	background: #e0e0e0;
	overflow: hidden;
	margin-bottom: 30px;
	margin-top: ${isIphoneSE() ? '60px' : '120px'};
`;

export default ProfilePic;
