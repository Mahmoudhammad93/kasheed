import * as React from 'react';
import {SafeAreaView, Text, StatusBar} from 'react-native';
import {DrawerActions, NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './src/navigations/AuthNavigator';
import COLORS from './src/constants/colors';

export default function App() {
  // isAuthenticated = is...
  return (
    <>
      <StatusBar backgroundColor={COLORS.main_color} />
      <NavigationContainer>
        {/* {isAuthenticated ? AuthNavigator : DrawerNavigator } */}
        <AuthNavigator />
      </NavigationContainer>
    </>
  );
}
