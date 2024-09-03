import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import { passwordReset } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { AuthStackParamList } from '../Routes';
import {
  BoldText,
  Button,
  DismissableView,
  DropdownConfirm,
  MediumText,
  RegularText,
  Spacer,
  TextInput,
} from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);

  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const [showConfirmPWResetDropdown, setShowConfirmPWResetDropdown] = useState({
    show: false,
    email: '',
  });

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email('Format email salah').required('Harus diisi'),
  });

  return (
    <Formik
      initialValues={{ email: '' }}
      validateOnBlur
      validateOnChange
      validationSchema={ValidationSchema}
      onSubmit={values => {
        setShowConfirmPWResetDropdown({
          show: true,
          email: values.email,
        });
      }}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <DismissableView
          style={{
            paddingTop: 72 + insets.top,
            ...styles.container,
          }}>
          <DropdownConfirm
            open={showConfirmPWResetDropdown.show}
            onClose={() => {
              setShowConfirmPWResetDropdown({
                show: false,
                email: '',
              });
            }}
            title="Konfirmasi Reset Password"
            content={
              <>
                <Spacer height={8} />
                <RegularText>
                  <RegularText type="body-medium">
                    Yakin mau reset password akun ini? Instruksi reset password
                    akan dikiriman ke email{' '}
                  </RegularText>
                  <RegularText type="body-medium" style={styles.emailText}>
                    {showConfirmPWResetDropdown.email}
                  </RegularText>
                </RegularText>
              </>
            }
            actions={{
              left: {
                label: 'Batal',
                onPress: () => {
                  setShowConfirmPWResetDropdown({
                    show: false,
                    email: '',
                  });
                },
              },
              right: {
                label: 'OK',
                onPress: () => {
                  dispatch(
                    passwordReset({
                      email: values.email,
                      onSuccess: () => {
                        setSnackbar({
                          show: true,
                          type: 'success',
                          message: `Instruksi reset password sudah dikiriman ke email ${showConfirmPWResetDropdown.email}`,
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
          <MediumText size={28} color="#BF2229" style={styles.title}>
            Lupa Password
          </MediumText>
          <Spacer height={40} />
          <TextInput
            ref={emailInputRef}
            id="email"
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            onSubmitEditing={() => {
              if (!values.password) {
                passwordInputRef.current?.focus();
              }
              emailInputRef.current?.blur();
            }}
            value={values.email}
            error={touched.email && errors.email}
          />
          <Spacer height={32} />
          <Button
            type="primary"
            disabled={!values.email || !!errors.email}
            onPress={handleSubmit}>
            Kirim Reset Password
          </Button>
          <Spacer height={16} />
          <View style={styles.row}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <RegularText color="#BF2229">Kembali ke Login</RegularText>
            </Pressable>
          </View>
        </DismissableView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  emailText: {
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  tosCheck: {
    flexDirection: 'row',
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    alignSelf: 'center',
    padding: 4,
  },
});
