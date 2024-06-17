import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { asyncStorage } from '../../store';
import { RootStackParamList } from '../Routes';
import { RegularText, SimpleList, Spacer } from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          ...styles.container,
        }}>
        <RegularText type="label-medium" color="#74777F">
          App Settings
        </RegularText>
        <Spacer height={4} />
        <SimpleList
          icon="user"
          title="Personal Information"
          subtitle="Your account information"
          onPress={() => {
            navigation.navigate('PersonalInformation');
          }}
        />
        <SimpleList
          icon="lock"
          title="Password"
          subtitle="Change your password"
          onPress={() => {
            navigation.navigate('NewPassword');
          }}
        />
        <SimpleList
          icon="info"
          title="User Guideline"
          subtitle="Learn more about how to use app"
          onPress={() => {
            // TODO: Go to User Guideline screen
          }}
        />
        <SimpleList
          easterEgg
          icon="info"
          title="About"
          subtitle="Version 1.0"
        />
        <Spacer height={24} />
        <SimpleList
          icon="log-out"
          title="Sign Out"
          color={{
            icon: '#BA1A1A',
            title: '#BA1A1A',
            chevron: '#BA1A1A',
          }}
          onPress={() => {
            asyncStorage.removeItem('userCredentials');
          }}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  column: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
});
