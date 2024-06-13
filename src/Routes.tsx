import { NavigatorScreenParams } from '@react-navigation/core';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useMMKVStorage } from 'react-native-mmkv-storage';

import { asyncStorage } from '../store';
import BottomTabs from './BottomTabs';
import { NavigationHeader } from './components';
import { EasterEggScreen, SignInScreen, SignUpScreen } from './screens';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type BottomTabsParamList = {
  Home: undefined;
  Report: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabsParamList>;
  EasterEgg: undefined;
};

const MainStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

export default () => {
  const [credentials] = useMMKVStorage('userCredentials', asyncStorage, null);

  if (!credentials) {
    return (
      <MainStack.Navigator
        initialRouteName="BottomTabs"
        screenOptions={{ header: NavigationHeader }}>
        <MainStack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="EasterEgg"
          component={EasterEggScreen}
          options={{
            title: 'You found an egg 🥚',
            headerShown: false,
          }}
        />
      </MainStack.Navigator>
    );
  }
  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};
