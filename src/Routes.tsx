import { NavigatorScreenParams } from '@react-navigation/core';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useMMKVStorage } from 'react-native-mmkv-storage';

import { asyncStorage } from '../store';
import BottomTabs from './BottomTabs';
import { NavigationHeader } from './components';
import {
  ChangePasswordScreen,
  EasterEggScreen,
  EditMasterDataScreen,
  FundsDataScreen,
  MemberDonationsScreen,
  MemberDuesScreen,
  MemberInterestsScreen,
  NewMasterDataScreen,
  NewMemberDonationScreen,
  NewMemberDueScreen,
  NewTransactionMenuScreen,
  PersonalInformationScreen,
  ResetPasswordScreen,
  SignInScreen,
  SignUpScreen,
} from './screens';
import NewMemberInterestScreen from './screens/Master/NewMemberInterestScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
};

export type BottomTabsParamList = {
  Home: undefined;
  MemberList: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabsParamList>;
  FundsData: undefined;
  NewMasterData: undefined;
  EditMasterData: {
    memberCode: string;
  };
  MemberDues: {
    memberCode: string;
    fullName: string;
  };
  NewMemberDue: {
    memberCode: string;
    fullName: string;
  };
  MemberDonations: {
    memberCode: string;
    fullName: string;
  };
  NewMemberDonation: {
    memberCode: string;
    fullName: string;
  };
  MemberInterests: {
    memberCode: string;
    fullName: string;
  };
  NewMemberInterest: {
    memberCode: string;
    fullName: string;
  };
  NewTransactionMenu: undefined;
  PersonalInformation: undefined;
  ChangePassword: undefined;
  EasterEgg: undefined;
};

const MainStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

export default () => {
  const [credentials] = useMMKVStorage('credentials', asyncStorage, null);

  if (credentials) {
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
          name="FundsData"
          component={FundsDataScreen}
          options={{ title: 'Data Kas' }}
        />
        <MainStack.Screen
          name="NewMasterData"
          component={NewMasterDataScreen}
          options={{ title: 'Data Baru' }}
        />
        <MainStack.Screen
          name="EditMasterData"
          component={EditMasterDataScreen}
          options={{ title: 'Edit Data Master' }}
        />
        <MainStack.Screen name="MemberDues" component={MemberDuesScreen} />
        <MainStack.Screen name="NewMemberDue" component={NewMemberDueScreen} />
        <MainStack.Screen
          name="MemberDonations"
          component={MemberDonationsScreen}
        />
        <MainStack.Screen
          name="NewMemberDonation"
          component={NewMemberDonationScreen}
        />
        <MainStack.Screen
          name="MemberInterests"
          component={MemberInterestsScreen}
        />
        <MainStack.Screen
          name="NewMemberInterest"
          component={NewMemberInterestScreen}
        />
        <MainStack.Screen
          name="NewTransactionMenu"
          component={NewTransactionMenuScreen}
        />
        <MainStack.Screen
          name="PersonalInformation"
          component={PersonalInformationScreen}
        />
        <MainStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
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
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};
