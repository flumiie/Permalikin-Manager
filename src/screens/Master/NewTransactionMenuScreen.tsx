import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import 'react-native-safe-area-context';

import { asyncStorage } from '../../../store';
import { RootStackParamList } from '../../Routes';
import { BoldText, RegularText, Spacer } from '../../components';

export default () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.contentContainer}>
            <BoldText type="title-medium">Menu transaksi baru</BoldText>
            <Spacer height={4} />
            <RegularText type="body-small" color="#4B4B4B">
              Pilih tipe transaksi yang ingin dibuat
            </RegularText>
            <Spacer height={24} />
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
});
