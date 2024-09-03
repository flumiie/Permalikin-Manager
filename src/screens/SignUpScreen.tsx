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
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { asyncStorage } from '../../store';
import { signUp } from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { AuthStackParamList } from '../Routes';
import {
  Button,
  DismissableView,
  MediumText,
  RegularText,
  Spacer,
  TextInput,
} from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const authNavigation =
    useNavigation<StackNavigationProp<AuthStackParamList>>();

  const [_, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);
  const [__, setCredentials] = useMMKVStorage<{
    token: string;
    name: string;
    email: string;
    photo: string;
  }>('credentials', asyncStorage, {
    token: '',
    name: '',
    email: '',
    photo: '',
  });
  const [___, setRegistrationStatus] = useMMKVStorage(
    'registrationStatus',
    asyncStorage,
    false,
  );

  const nameInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const [passwordInvisible, setPasswordInvisible] = useState(true);
  const [tosChecked, setTosChecked] = useState(false);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required('Harus diisi'),
    email: Yup.string().required('Harus diisi').email('Invalid email address'),
    password: Yup.string().required('Harus diisi'),
  });

  return (
    <Formik
      enableReinitialize={false}
      initialValues={{ name: '', email: '', password: '' }}
      validateOnBlur
      validateOnChange
      validationSchema={ValidationSchema}
      onSubmit={values => {
        dispatch(
          signUp({
            name: values.name,
            email: values.email,
            password: values.password,
            onSuccess: v => {
              v.user.getIdTokenResult().then(S => {
                setRegistrationStatus(true);
                setSnackbar({
                  show: true,
                  type: 'success',
                  message: 'Registrasi berhasil',
                });
                setCredentials({
                  token: S.token ?? '',
                  name: v.user.displayName ?? '',
                  email: v.user.email ?? '',
                  photo: v.user.photoURL ?? '',
                });
              });
            },
            onError: v => {
              if (v.code === 'auth/email-already-in-use') {
                setSnackbar({
                  show: true,
                  type: 'error',
                  message: 'Email sudah dipakai',
                });
              }

              if (v.code === 'auth/weak-password') {
                setSnackbar({
                  show: true,
                  type: 'error',
                  message: 'Password minimal 6 karakter',
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
        <DismissableView
          style={{
            paddingTop: 72 + insets.top,
            ...styles.container,
          }}>
          <MediumText size={28} color="#BF2229" style={styles.title}>
            Registrasi
          </MediumText>
          <Spacer height={40} />
          <TextInput
            ref={nameInputRef}
            id="name"
            placeholder="Nama"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            onSubmitEditing={() => {
              if (!values.email) {
                emailInputRef.current?.focus();
              } else if (!values.password) {
                passwordInputRef.current?.focus();
              }
              nameInputRef.current?.blur();
            }}
            value={values.name}
            error={touched.name && errors.name}
          />
          <Spacer height={16} />
          <TextInput
            ref={emailInputRef}
            id="email"
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            onSubmitEditing={() => {
              if (!values.name) {
                nameInputRef.current?.focus();
              } else if (!values.password) {
                passwordInputRef.current?.focus();
              }
              emailInputRef.current?.blur();
            }}
            value={values.email}
            error={touched.email && errors.email}
          />
          <Spacer height={16} />
          <TextInput
            ref={passwordInputRef}
            id="password"
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            onSubmitEditing={() => {
              if (!values.name) {
                nameInputRef.current?.focus();
              } else if (!values.email) {
                emailInputRef.current?.focus();
              }
              passwordInputRef.current?.blur();
            }}
            secureTextEntry={passwordInvisible}
            rightIcons={{
              password: passwordInvisible ? 'eye-off' : 'eye',
            }}
            showPassword={() => {
              setPasswordInvisible(!passwordInvisible);
            }}
            value={values.password}
            error={touched.password && errors.password}
          />
          <Spacer height={20} />
          <BouncyCheckbox
            size={24}
            fillColor="#BF2229"
            unFillColor="#FFF"
            innerIconStyle={styles.checkboxIcon}
            textComponent={
              <View style={styles.checkboxContent}>
                <Spacer width={14} />
                <RegularText size={12} style={styles.textWrap}>
                  Saya menyetujui{' '}
                  <RegularText
                    size={12}
                    color="#BF2229"
                    onPress={() => {
                      //TODO: Terms of Service page
                    }}>
                    Persyaratan Layanan
                  </RegularText>{' '}
                  dan{' '}
                  <RegularText
                    size={12}
                    color="#BF2229"
                    onPress={() => {
                      //TODO: Privacy Policy page
                    }}>
                    Kebijakan Privasi
                  </RegularText>
                </RegularText>
              </View>
            }
            onPress={(isChecked: boolean) => {
              setTosChecked(isChecked);
            }}
          />
          <Spacer height={32} />
          <Button
            type="primary"
            disabled={
              !values.name ||
              !!errors.name ||
              !values.email ||
              !!errors.email ||
              !values.password ||
              !!errors.password ||
              !tosChecked
            }
            onPress={handleSubmit}>
            Buat Akun
          </Button>
          <Spacer height={16} />
          <View style={styles.row}>
            <RegularText>Sudah punya akun? </RegularText>
            <Pressable
              onPress={() => {
                authNavigation.goBack();
              }}>
              <RegularText color="#BF2229">Login disini</RegularText>
            </Pressable>
          </View>
        </DismissableView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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
  title: {
    textAlign: 'center',
  },
  checkboxContent: {
    flexDirection: 'row',
  },
  checkboxIcon: {
    borderRadius: 4,
    borderWidth: 3.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textWrap: {
    flexShrink: 1,
  },
});
