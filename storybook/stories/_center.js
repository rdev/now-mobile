import React from 'react';
import { View } from 'react-native';

const style = {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	paddingHorizontal: 25,
};

export default story => <View style={style}>{story()}</View>;
