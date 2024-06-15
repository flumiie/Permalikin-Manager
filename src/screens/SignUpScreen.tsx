import { useNavigation } from '@react-navigation/core';
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
  MediumText,
  RegularText,
  Snackbar,
  Spacer,
  TextInput,
} from '../components';

export default () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [_, setRegistrationStatus] = useMMKVStorage(
    'registrationStatus',
    asyncStorage,
    null,
  );

  const nameInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const [passwordInvisible, setPasswordInvisible] = useState(true);
  const [tosChecked, setTosChecked] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbar, setSnackbar] = useState({
    type: 'success' as 'success' | 'error',
    message: '',
  });

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required('This field is mandatory'),
    email: Yup.string()
      .required('This field is mandatory')
      .email('Invalid email address'),
    password: Yup.string().required('This field is mandatory'),
  });

  return (
    <>
      <View style={{ paddingTop: insets.top }}>
        <Snackbar
          visible={showSnackbar}
          onHide={() => setShowSnackbar(false)}
          type={snackbar.type}
          message={snackbar.message}
        />
      </View>
      <View
        style={{
          paddingTop: 72 + insets.top,
          ...styles.container,
        }}>
        <MediumText size={28} color="#BF2229" style={styles.title}>
          Registrasi
        </MediumText>
        <Spacer height={40} />
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
                  setRegistrationStatus(v);
                },
                onError: () => {
                  setSnackbar({
                    type: 'error' as 'success' | 'error',
                    message: 'Ada kesalahan. Mohon coba lagi nanti',
                  });
                  setShowSnackbar(true);
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
            <View>
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
                Create Account
              </Button>
            </View>
          )}
        </Formik>
        <Spacer height={16} />
        <View style={styles.signInButtonContainer}>
          <RegularText>Already have an account? </RegularText>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <RegularText color="#BF2229">Sign In</RegularText>
          </Pressable>
        </View>
      </View>
    </>
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
  signInButtonContainer: {
    flexDirection: 'row',
  },
  textWrap: {
    flexShrink: 1,
  },
});
