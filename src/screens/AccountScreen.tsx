import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { asyncStorage } from '../../store';
import { passwordReset } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { RootStackParamList } from '../Routes';
import {
  BoldText,
  DropdownConfirm,
  RegularText,
  SimpleList,
  Spacer,
} from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [credentials] = useMMKVStorage<{
    email: string;
  } | null>('credentials', asyncStorage, null);
  const [showConfirmPWResetDropdown, setShowConfirmPWResetDropdown] =
    useState(false);
  const [showConfirmLogoutDropdown, setShowConfirmLogoutDropdown] =
    useState(false);

  return (
    <>
      <DropdownConfirm
        open={showConfirmPWResetDropdown}
        onClose={() => {
          setShowConfirmPWResetDropdown(false);
        }}
        content={
          <>
            <BoldText type="title-medium">Konfirmasi Reset Password</BoldText>
            <Spacer height={8} />
            <RegularText>
              <RegularText type="body-small">
                Yakin mau reset password akun ini? Instruksi reset password akan
                dikiriman ke email{' '}
              </RegularText>
              <RegularText type="body-small" style={styles.emailText}>
                {credentials?.email}
              </RegularText>
            </RegularText>
          </>
        }
        actions={{
          left: {
            label: 'Batal',
            onPress: () => {
              setShowConfirmPWResetDropdown(false);
            },
          },
          right: {
            label: 'OK',
            onPress: () => {
              dispatch(
                passwordReset({
                  email: credentials?.email ?? '',
                  onSuccess: () => {
                    setSnackbar({
                      show: true,
                      type: 'success',
                      message: `Instruksi reset password sudah dikiriman ke email ${credentials?.email}`,
                    });
                  },
                  onError: () => {
                    setSnackbar({
                      show: true,
                      type: 'error',
                      message: 'Ada kesalahan. Mohon coba lagi nanti',
                    });
                  },
                }),
              );
            },
          },
        }}
      />
      <DropdownConfirm
        open={showConfirmLogoutDropdown}
        onClose={() => {
          setShowConfirmLogoutDropdown(false);
        }}
        content={
          <>
            <BoldText type="title-medium">Konfirmasi Logout</BoldText>
            <Spacer height={8} />
            <RegularText type="body-small">
              Yakin mau keluar dari akun ini?
            </RegularText>
          </>
        }
        actions={{
          left: {
            label: 'Batal',
            onPress: () => {
              setShowConfirmLogoutDropdown(false);
            },
          },
          right: {
            label: 'OK',
            onPress: () => {
              setShowConfirmLogoutDropdown(false);
              GoogleSignin.signOut();
              asyncStorage.removeItem('credentials');
            },
          },
        }}
      />
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
          title="Info Personal"
          subtitle="informasi akun Anda"
          onPress={() => {
            navigation.navigate('PersonalInformation');
          }}
        />
        <SimpleList
          icon="lock"
          title="Reset Password"
          subtitle="Reset password akan dikiriman ke email"
          onPress={() => {
            setShowConfirmPWResetDropdown(true);
          }}
        />
        <SimpleList
          icon="info"
          title="Pedoman Pengguna"
          subtitle="Pelajari cara menggunakan apl. ini"
          onPress={() => {
            // TODO: Go to User Guideline screen
            setSnackbar({
              show: true,
              type: 'error',
              message: 'Sementara ini tidak tersedia',
            });
          }}
        />
        <SimpleList easterEgg icon="info" title="Tentang" subtitle="v1.0.5" />
        <Spacer height={24} />
        <SimpleList
          icon="log-out"
          title="Keluar"
          color={{
            icon: '#BA1A1A',
            title: '#BA1A1A',
            chevron: '#BA1A1A',
          }}
          onPress={() => {
            setShowConfirmLogoutDropdown(true);
          }}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  emailText: {
    textDecorationLine: 'underline',
  },
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
