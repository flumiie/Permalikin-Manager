import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import { changePassword } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { Button, RegularText, Spacer, TextInput } from '../components';

export default () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [credentials] = useMMKVStorage<{
    token: string;
  } | null>('userCredentials', asyncStorage, null);

  const newPasswordInputRef = useRef<RNTextInput>(null);
  const confirmNewPasswordInputRef = useRef<RNTextInput>(null);
  const [passwordInvisible, setPasswordInvisible] = useState({
    oldPassword: true,
    newPassword: true,
    confirmNewPassword: true,
  });

  const ValidationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('This field is mandatory'),
    newPassword: Yup.string()
      .required('This field is mandatory')
      .oneOf([Yup.ref('confirmNewPassword')], 'New passwords must match')
      .notOneOf([Yup.ref('oldPassword')], 'Please enter a new password'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'New passwords must match')
      .notOneOf([Yup.ref('oldPassword')], 'Please enter a new password'),
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validateOnBlur
        validateOnChange
        validationSchema={ValidationSchema}
        onSubmit={values => {
          dispatch(
            changePassword({
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
              confirmNewPassword: values.confirmNewPassword,
              onSuccess: v => {
                if (v.user) {
                  setSnackbar({
                    show: true,
                    type: 'success',
                    message: 'Password sudah diubah',
                  });
                  navigation.goBack();
                }
              },
              onError: v => {
                if (v.code === 'auth/invalid-credential') {
                  setSnackbar({
                    show: true,
                    type: 'error',
                    message: 'Password lama salah',
                  });
                } else if (v.code === 'auth/too-many-requests') {
                  setSnackbar({
                    show: true,
                    type: 'error',
                    message: 'Terlalu banyak request. Coba lagi nanti',
                  });
                } else {
                  setSnackbar({
                    show: true,
                    type: 'error',
                    message: 'Something wrong happened. Please try again',
                  });
                }
              },
            }),
          );
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <ScrollView contentContainerStyle={styles.container}>
            <RegularText type="body-medium" color="#4B4B4B">
              Jaga keamanan Anda dengan mengganti password yang lebih kuat
            </RegularText>
            <Spacer height={44} />
            <TextInput
              id="oldPassword"
              placeholder="Password lama"
              onChangeText={handleChange('oldPassword')}
              onBlur={handleBlur('oldPassword')}
              secureTextEntry={passwordInvisible.oldPassword}
              rightIcons={{
                password: passwordInvisible.oldPassword ? 'eye-off' : 'eye',
              }}
              showPassword={() => {
                setPasswordInvisible({
                  ...passwordInvisible,
                  oldPassword: !passwordInvisible.oldPassword,
                });
              }}
              onSubmitEditing={() => {
                newPasswordInputRef.current?.focus();
              }}
              value={values.oldPassword}
              error={touched.oldPassword && errors.oldPassword}
            />
            <Spacer height={16} />
            <TextInput
              ref={newPasswordInputRef}
              id="newPassword"
              placeholder="Password baru"
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              secureTextEntry={passwordInvisible.newPassword}
              rightIcons={{
                password: passwordInvisible.newPassword ? 'eye-off' : 'eye',
              }}
              showPassword={() => {
                setPasswordInvisible({
                  ...passwordInvisible,
                  newPassword: !passwordInvisible.newPassword,
                });
              }}
              onSubmitEditing={() => {
                confirmNewPasswordInputRef.current?.focus();
              }}
              value={values.newPassword}
              error={touched.newPassword && errors.newPassword}
            />
            <Spacer height={16} />
            <TextInput
              ref={confirmNewPasswordInputRef}
              id="confirmNewPassword"
              placeholder="Konfirmasi password baru"
              onChangeText={handleChange('confirmNewPassword')}
              onBlur={handleBlur('confirmNewPassword')}
              secureTextEntry={passwordInvisible.confirmNewPassword}
              rightIcons={{
                password: passwordInvisible.confirmNewPassword
                  ? 'eye-off'
                  : 'eye',
              }}
              showPassword={() => {
                setPasswordInvisible({
                  ...passwordInvisible,
                  confirmNewPassword: !passwordInvisible.confirmNewPassword,
                });
              }}
              value={values.confirmNewPassword}
              error={touched.confirmNewPassword && errors.confirmNewPassword}
            />
            <Spacer height={40} />
            <Button
              type="primary"
              disabled={
                !values.newPassword ||
                !!errors.newPassword ||
                !values.confirmNewPassword ||
                !!errors.confirmNewPassword
              }
              onPress={handleSubmit}>
              Ubah password
            </Button>
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FCFCFF',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 24,
    justifyContent: 'center',
    backgroundColor: '#1B72C0',
  },
  cameraIcon: {
    alignSelf: 'center',
    bottom: 1,
  },
});
